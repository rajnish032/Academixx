import postModel from "../models/post/post.model.js";
import User from "../models/user.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadImage } from "../utils/imagekit.js";
import {
  deleteFileFromCloudinary,
  uploadPostMediaToCloudinary,
} from "../utils/cloudinary.js";
import reactionModel from "../models/post/reaction.model.js";
import commentModel from "../models/post/comment.model.js";


const MAX_FEED_LIMIT = 50;
const MAX_COMMENT_LIMIT = 100;

export const createPost = asyncHandler(async (req, res) => {
  const { text, tag } = req.body;

  const allowedTags = ["general", "streak", "other", "public"];

  if (!allowedTags.includes(tag)) {
    return res.status(400).json({ message: "Invalid tag" });
  }

  let mediaUrl = "";
  let mediaType = "";

  if (!text && !req.file) {
    return res.status(400).json({ message: "Post data required" });
  }

  if (req.file) {
    const { mimetype } = req.file;

    if (mimetype === "application/pdf") {
      const uploadResult = await uploadImage(
        req.file.buffer,
        req.file.originalname
      );

      mediaUrl = uploadResult.url;
      mediaType = "pdf";

      console.log(uploadResult);
    } else {
      const result = await uploadPostMediaToCloudinary(req.file);

      mediaUrl = result.secure_url;
      mediaType = result.resource_type;
    }
  }

  const user = await User.findById(req.user._id)
    .select("firstName lastName  avatar")
    .lean();

    console.log("User Data:", user);

  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }

  const post = await postModel.create({
    authorId: user._id,
    authorSnapshot: {
      _id: user._id,
      fullName: `${user.firstName} ${user.lastName}`,
      avatar: user.avatar,
    },
    text,
    mediaUrl,
    mediaType,
    tag,
  });



  return res.status(201).json(post);
});

export const updatePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const { text } = req.body;
  const post = await postModel.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (String(post.authorId) !== String(req.user._id)) {
    return res
      .status(403)
      .json({ message: "Not authorized to edit this post" });
  }

  let mediaUrl = post.mediaUrl;
  let mediaType = post.mediaType;

  // If new media uploaded → replace existing
  if (req.file) {
    const delUrl = mediaUrl;
    const { mimetype } = req.file;
    if (mimetype === "application/pdf") {
      const uploadResult = await uploadImage(
        req.file.buffer,
        req.file.originalname,
      );
      mediaUrl = uploadResult.url;
      mediaType = "pdf";
    } else {
      const result = await uploadPostMediaToCloudinary(req.file, "auto:best");
      mediaUrl = result.secure_url;
      mediaType = result.resource_type;
    }
    if (post.mediaType != "pdf") {
      await deleteFileFromCloudinary(delUrl);
    }
  }

  if (text !== undefined) post.text = text;

  post.mediaUrl = mediaUrl;
  post.mediaType = mediaType;

  await post.save();
  const reaction = await reactionModel
    .findOne({
      targetType: "Post",
      targetId: post._id,
      userId: req.user._id,
    })
    .select("_id");

  const postObj = post.toObject();
  postObj.likedByUser = !!reaction;

  return res.status(200).json({
    message: "Post updated successfully",
    post: postObj,
  });
});


export const deletePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const post = await postModel.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (String(post.authorId) !== String(req.user._id)) {
    return res
      .status(403)
      .json({ message: "Not authorized to delete this post" });
  }
  const mediaType = post.mediaType;
  const delUrl = post.mediaUrl;

  await postModel.findByIdAndDelete(postId);

  await commentModel.deleteMany({ postId });
  await reactionModel.deleteMany({ targetType: "Post", targetId: postId });
  if (mediaType != "pdf") {
    await deleteFileFromCloudinary(delUrl);
  }
  return res.json({ message: "Post deleted successfully" });
});

export const getFeed = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || "12", 10), MAX_FEED_LIMIT);
  const cursor = req.query.cursor ? new Date(req.query.cursor) : null;
  const q = {};
  if (req.query.tag && req.query.tag !== "all") {
    q.tag = req.query.tag;
  }
  if (cursor) q.createdAt = { $lt: cursor };

  let posts = await postModel
    .find(q)
    .sort({ createdAt: -1 })
    .limit(limit + 1)
    .lean();
  const hasMore = posts.length > limit;
  if (hasMore) posts.pop();

  const ids = posts.map((p) => p._id);
  const reactions = await reactionModel
    .find({
      targetType: "Post",
      targetId: { $in: ids },
      userId: req.user._id,
    })
    .select("targetId")
    .lean();

  const likedSet = new Set(reactions.map((r) => String(r.targetId)));
  posts = posts.map((p) => ({
    ...p,
    likedByUser: likedSet.has(String(p._id)),
  }));

  const nextCursor =
    hasMore && posts.length
      ? posts[posts.length - 1].createdAt.toISOString()
      : null;

  return res.json({
    data: posts,
    nextCursor,
  });
});

export const getSinglePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await postModel.findById(postId).lean();

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  let likedByUser = false;

  if (req.user?._id) {
    const reaction = await reactionModel.findOne({
      targetType: "Post",
      targetId: post._id,
      userId: req.user._id,
    });

    likedByUser = !!reaction;
  }

  return res.json({
    ...post,
    likedByUser,
  });
});

export const toggleLike = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.postId;

  try {
    await reactionModel.create({
      targetType: "Post",
      targetId: postId,
      userId,
    });

    await postModel.findByIdAndUpdate(postId, {
      $inc: { likesCount: 1 },
    });

    return res.json({ liked: true });
  } catch (err) {
    if (err && err.code === 11000) {
      await reactionModel.findOneAndDelete({
        targetType: "Post",
        targetId: postId,
        userId,
      });

      const post = await postModel.findById(postId).select("likesCount");

if (post && post.likesCount > 0) {
  await postModel.findByIdAndUpdate(postId, {
    $inc: { likesCount: -1 },
  });
}

      return res.json({ liked: false });
    }

    throw err;
  }
});

export const getPostLikes = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const reactions = await reactionModel
    .find({
      targetType: "Post",
      targetId: postId,
    })
    .sort({ createdAt: -1 })
    .populate({
      path: "userId",
      select: "firstName lastName  avatar",
    })
    .lean();

  const users = reactions
    .filter((r) => r.userId) // safety
    .map((r) => r.userId);

  return res.json({ data: users });
});

export const addComment = asyncHandler(async (req, res) => {
  const text = (req.body.text || "").trim();
  if (!text) return res.status(400).json({ error: "empty comment" });

  const post = await postModel
    .findById(req.params.postId)
    .select("_id authorId")
    .lean();

  if (!post) return res.status(404).json({ error: "post not found" });

  const user = await User.findById(req.user._id)
    .select("firstName lastName  avatar")
    .lean();

  if (!user) return res.status(404).json({ error: "user not found" });

  const comment = await commentModel.create({
    postId: req.params.postId,
    authorId: user._id,
    authorSnapshot: {
      _id: user._id,
      fullName: `${user.firstName} ${user.lastName}`,
      avatar: user.avatar,
    },
    text,
  });

  await postModel.findByIdAndUpdate(req.params.postId, {
    $inc: { commentsCount: 1 },
  });

  return res.status(201).json({
    message: "Comment added successfully",
    comment,
  });
});
  

export const getComments = asyncHandler(async (req, res) => {
  const postId = req.params.postId;

  const comments = await commentModel
    .find({ postId })
    .sort({ createdAt: -1 })
    .lean();

  return res.json({
    data: comments,
    count: comments.length,
  });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user._id;

  const comment = await commentModel.findById(commentId);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  const post = await postModel.findById(comment.postId).select("authorId");
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const isCommentOwner = String(comment.authorId) === String(userId);
  const isPostOwner = String(post.authorId) === String(userId);

  if (!isCommentOwner && !isPostOwner) {
    return res.status(403).json({
      message: "You are not authorized to delete this comment",
    });
  }

  await commentModel.findByIdAndDelete(commentId);

  await postModel.findByIdAndUpdate(comment.postId, {
    $inc: { commentsCount: -1 },
  });

  return res.json({ message: "Comment deleted successfully" });
});