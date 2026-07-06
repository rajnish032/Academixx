import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

import CreatePostBox from "./CreatePostBox";
import CreatePostModal from "./CreatePostModal";
import EditPostModal from "./EditPostModal";
import PostCard from "./PostCard";
import SkeletonPost from "./SkeletonPost";

import { VideoSoundProvider } from "../../context/VideoSoundContext";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";



const TAG_OPTIONS = ["general", "streak", "other", "public"];
const LIMIT = 12;

export default function Feed() {
  const { userData, backendUrl } = useContext(AppContext);
  const queryClient = useQueryClient();
  // -------------------------
  // CREATE POST MODAL
  // -------------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [file, setFile] = useState(null);
  const [posting, setPosting] = useState(false);
  const [selectedTag, setSelectedTag] = useState("public");

  // -------------------------
  // EDIT POST MODAL
  // -------------------------
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [editText, setEditText] = useState("");
  const [editTag, setEditTag] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [editPostLoading, setEditPostLoading] = useState(false);


  // -------------------------
  // FEED FETCH (REACT QUERY)
  // -------------------------
  const [fetchTag, setFetchTag] = useState("All");
  const fetchFeed = async ({ pageParam = null }) => {
    const url = `${backendUrl}/api/feed?limit=${LIMIT}${
      pageParam ? `&cursor=${pageParam}` : ""
    }${fetchTag !== "All" ? `&tag=${fetchTag}` : ""}`;

    const res = await axios.get(url);

    return res.data; // { data, nextCursor }
  };

  useEffect(() => {
    queryClient.removeQueries({ queryKey: ["feed"], exact: true });
  }, [fetchTag]);

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["feed"],
      queryFn: fetchFeed,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
    });

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  // -------------------------
  // INFINITE SCROLL (OBSERVER)
  // -------------------------
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      },
      { rootMargin: "400px" },
    );

    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  // -------------------------
  // CREATE POST (NO REFETCH)
  // -------------------------
  const handlePost = async () => {
    if (!newPost.trim() && !file) {
      toast.error("Write something or upload media");
      return;
    }

    if (file) {
      const fileType = file.type;
      const fileSizeMB = file.size / (1024 * 1024);

      const isImage = fileType.startsWith("image/");
      const isVideo = fileType.startsWith("video/");
      const isPDF = fileType === "application/pdf" || fileType.endsWith("+pdf");

      if (!isImage && !isVideo && !isPDF) {
        toast.error("Only images, videos, or PDF files are allowed");
        return;
      }

      if ((isImage || isPDF) && fileSizeMB > 10) {
        toast.error("Images and PDFs must be 10MB or smaller");
        return;
      }

      if (isVideo && fileSizeMB > 100) {
        toast.error("Videos must be 100MB or smaller");
        return;
      }
    }

    setPosting(true);

    try {
      console.log("Posting.....");
      const fd = new FormData();
      fd.append("text", newPost);
      fd.append("tag", selectedTag);
      if (file) fd.append("media", file);

      const res = await axios.post(`${backendUrl}/api/post`, fd, {});
      const newPostData = res?.data;
      queryClient.setQueryData(["feed"], (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: [
            {
              ...old.pages[0],
              data: [newPostData, ...old.pages[0].data],
            },
            ...old.pages.slice(1),
          ],
        };
      });

      setNewPost("");
      setFile(null);
      setIsModalOpen(false);
      toast.success("Post created");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create post");
    } finally {
      setPosting(false);
    }
  };

  // -------------------------
  // LIKE / UNLIKE (UNCHANGED)
  // -------------------------
  const handleLike = async (postId) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/post/${postId}/toggle-like`,
        {},
      );

      const liked = res.data.liked;

      queryClient.setQueryData(["feed"], (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((p) =>
              p._id === postId
                ? {
                    ...p,
                    likedByUser: liked,
                    likesCount: p.likesCount + (liked ? 1 : -1),
                  }
                : p,
            ),
          })),
        };
      });
    } catch {
      toast.error("Failed to like post");
    }
  };

  // -------------------------
  // COMMENTS / EDIT (UNCHANGED)
  // -------------------------
  const loadComments = async (postId) => {
    try {
      const res = await axios.get(`${backendUrl}/api/post/${postId}/comments`, {});

      const comments = res.data.data;

      queryClient.setQueryData(["feed"], (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((p) =>
              p._id === postId ? { ...p, comments, showComments: true } : p,
            ),
          })),
        };
      });
    } catch {
      toast.error("Failed to load comments");
    }
  };

  const addComment = async (postId, text) => {
     
    try {
      const res = await axios.post(`${backendUrl}/api/post/${postId}/comments`, {
        text,
      });

      const newComment = res.data.comment;

      queryClient.setQueryData(["feed"], (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((p) =>
              p._id === postId
                ? {
                    ...p,
                    comments: [newComment, ...(p.comments || [])],
                    commentsCount: p.commentsCount + 1,
                  }
                : p,
            ),
          })),
        };
      });
    } catch {
      toast.error("Failed to comment");
    }
  };

  const deleteComment = async (postId, commentId) => {
    try {
      await axios.delete(`${backendUrl}/api/comments/${commentId}`, {});

      queryClient.setQueryData(["feed"], (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((p) =>
              p._id === postId
                ? {
                    ...p,
                    comments: p.comments.filter((c) => c._id !== commentId),
                    commentsCount: p.commentsCount - 1,
                  }
                : p,
            ),
          })),
        };
      });
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  const openEdit = (post) => {
    setEditPost(post);
    setEditText(post.text);
    setEditTag(post.tag);
    setEditFile(null);
    setEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editPost) return;

    setEditPostLoading(true);

    // FILE VALIDATION (UNCHANGED)
    if (editFile) {
      const fileType = editFile.type;
      const fileSizeMB = editFile.size / (1024 * 1024);

      const isImage = fileType.startsWith("image/");
      const isVideo = fileType.startsWith("video/");
      const isPDF = fileType === "application/pdf" || fileType.endsWith("+pdf");

      if (!isImage && !isVideo && !isPDF) {
        toast.error("Only images, videos, or PDF files are allowed");
        setEditPostLoading(false);
        return;
      }

      if ((isImage || isPDF) && fileSizeMB > 10) {
        toast.error("Images and PDFs must be 10MB or smaller");
        setEditPostLoading(false);
        return;
      }

      if (isVideo && fileSizeMB > 100) {
        toast.error("Videos must be 100MB or smaller");
        setEditPostLoading(false);
        return;
      }
    }

    try {
      const fd = new FormData();
      fd.append("text", editText);
      fd.append("tag", editTag);
      if (editFile) fd.append("media", editFile);

      const res = await axios.put(`${backendUrl}/api/post/${editPost._id}`, fd, {});
      const updatedPost = res?.data?.post;
      // 🔥 UPDATE POST IN CACHE (NO FETCH)
      queryClient.setQueryData(["feed"], (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((p) =>
              p._id === editPost._id ? updatedPost : p,
            ),
          })),
        };
      });

      setEditModalOpen(false);
      toast.success("Post updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update post");
    } finally {
      setEditPostLoading(false);
    }
  };

  // delete post
  const handleDeletePost = async (postId) => {
    // Save current cache for rollback
    const previousFeed = queryClient.getQueryData(["feed"]);

    // 🔥 Optimistically remove post from UI
    queryClient.setQueryData(["feed"], (old) => {
      if (!old) return old;

      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          data: page.data.filter((p) => p._id !== postId),
        })),
      };
    });

    try {
      await axios.delete(`${backendUrl}/api/post/${postId}`, {});

      toast.success("Post deleted");
    } catch (err) {
      // ❌ Rollback if delete fails
      queryClient.setQueryData(["feed"], previousFeed);
      toast.error(err.response?.data?.message || "Failed to delete post");
    }
  };

  // -------------------------
  // RENDER
  // -------------------------
  return (
  <div className="max-w-xl mx-auto space-y-6 mt-5 pb-20">
    <CreatePostBox
      currentUser={userData}
      openModal={() => setIsModalOpen(true)}
    />

    <CreatePostModal
      isOpen={isModalOpen}
      closeModal={() => {
        setNewPost("");
        setFile(null);
        setIsModalOpen(false);
      }}
      newPost={newPost}
      setNewPost={setNewPost}
      selectedTag={selectedTag}
      setSelectedTag={setSelectedTag}
      file={file}
      setFile={setFile}
      handlePost={handlePost}
      TAG_OPTIONS={TAG_OPTIONS}
      currentUser={userData}
      posting={posting}
    />

    <EditPostModal
      isOpen={editModalOpen}
      closeModal={() => setEditModalOpen(false)}
      editText={editText}
      setEditText={setEditText}
      editTag={editTag}
      setEditTag={setEditTag}
      editFile={editFile}
      setEditFile={setEditFile}
      handleUpdate={handleUpdate}
      TAG_OPTIONS={TAG_OPTIONS}
      post={editPost}
      editPostLoading={editPostLoading}
    />

    {/* Filter pills */}
    <div className="px-3 flex items-center gap-2">
      <button
        onClick={() => setFetchTag("All")}
        className={`font-meta text-[11px] uppercase px-4 py-1.5 transition-colors ${
          fetchTag === "All"
            ? "bg-oxblood text-paper border border-oxblood"
            : "bg-paper-alt text-navy border border-brass/50 hover:border-oxblood"
        }`}
      >
        All
      </button>
      <button
        onClick={() => setFetchTag("general")}
        className={`font-meta text-[11px] uppercase px-4 py-1.5 transition-colors ${
          fetchTag === "general"
            ? "bg-oxblood text-paper border border-oxblood"
            : "bg-paper-alt text-navy border border-brass/50 hover:border-oxblood"
        }`}
      >
        General
      </button>
      <button
        onClick={() => setFetchTag("streak")}
        className={`font-meta text-[11px] uppercase px-4 py-1.5 transition-colors ${
          fetchTag === "streak"
            ? "bg-oxblood text-paper border border-oxblood"
            : "bg-paper-alt text-navy border border-brass/50 hover:border-oxblood"
        }`}
      >
        Streak
      </button>
      <button
        onClick={() => setFetchTag("other")}
        className={`font-meta text-[11px] uppercase px-4 py-1.5 transition-colors ${
          fetchTag === "gis"
            ? "bg-oxblood text-paper border border-oxblood"
            : "bg-paper-alt text-navy border border-brass/50 hover:border-oxblood"
        }`}
      >
        Other
      </button>
    </div>

    {isLoading && [...Array(4)].map((_, i) => <SkeletonPost key={i} />)}

    <VideoSoundProvider>
      {posts.map((p) => (
        <PostCard
          key={p._id}
          post={{ ...p, currentUserId: userData?._id }}
          handleLike={handleLike}
          loadComments={loadComments}
          addComment={addComment}
          deleteComment={deleteComment}
          openEdit={openEdit}
          handleDeletePost={handleDeletePost}
        />
      ))}
    </VideoSoundProvider>

    {hasNextPage && (
      <div ref={bottomRef}>{isFetchingNextPage && <SkeletonPost />}</div>
    )}
  </div>
);
}
