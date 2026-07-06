import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import PostCard from "./PostCard";
import { VideoSoundProvider } from "../../context/VideoSoundContext";
import { AppContext } from "../../context/AppContext";



export default function SinglePostClient({ post }) {
  const navigate = useNavigate();
const { userData, backendUrl } = useContext(AppContext);
  const queryClient = useQueryClient();
  const postId = post._id;

  // -------------------------
  // HYDRATE CACHE FROM PROPS
  // -------------------------
  useEffect(() => {
    queryClient.setQueryData(["post", postId], post);
  }, [postId, post, queryClient]);

  // -------------------------
  // READ POST FROM CACHE
  // -------------------------
  const { data: postData } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => post, // ✅ never called
    enabled: false,      // cache-only
  });
  

  if (!postData) return null;

  const handleViewAllPosts = () => {
  navigate("/feed");
};

  // -------------------------
  // HELPERS (SYNC POST + FEED)
  // -------------------------
  const updateEverywhere = (updater) => {
    // single post
    queryClient.setQueryData(["post", postId], updater);

    // feed
    queryClient.setQueryData(["feed"], (old) => {
      if (!old) return old;

      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          data: page.data.map((p) =>
            p._id === postId ? updater(p) : p
          ),
        })),
      };
    });
  };

  // -------------------------
  // LIKE / UNLIKE
  // -------------------------
  const handleLike = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/post/${postId}/toggle-like`
      );

      const liked = res.data.liked;

      updateEverywhere((p) => ({
        ...p,
        likedByUser: liked,
        likesCount: p.likesCount + (liked ? 1 : -1),
      }));
    } catch {
      toast.error("Failed to like post");
    }
  };

  // -------------------------
  // LOAD COMMENTS
  // -------------------------
  const loadComments = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/post/${postId}/comments`
      );

      updateEverywhere((p) => ({
        ...p,
        comments: res.data.data,
        showComments: true,
      }));
    } catch {
      toast.error("Failed to load comments");
    }
  };

  // -------------------------
  // ADD COMMENT
  // -------------------------
  const addComment = async (_, text) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/post/${postId}/comments`,
        { text }
        
      );
      updateEverywhere((p) => ({
        ...p,
        comments: [res.data, ...(p.comments || [])],
        commentsCount: p.commentsCount + 1,
      }));
    } catch {
      toast.error("Failed to comment");
    }
  };

  // -------------------------
  // DELETE COMMENT
  // -------------------------
  const deleteComment = async (_, commentId) => {
    try {
      await axios.delete(`${backendUrl}/api/comments/${commentId}`);

      updateEverywhere((p) => ({
        ...p,
        comments: p.comments.filter((c) => c._id !== commentId),
        commentsCount: p.commentsCount - 1,
      }));
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  // -------------------------
  // DELETE POST
  // -------------------------
  const handleDeletePost = async () => {
    const previousFeed = queryClient.getQueryData(["feed"]);

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
      await axios.delete(`${backendUrl}/api/post/${postId}`);

      queryClient.removeQueries({ queryKey: ["post", postId] });
      toast.success("Post deleted");
      navigate("/feed");
    } catch (err) {
      queryClient.setQueryData(["feed"], previousFeed);
      toast.error("Failed to delete post");
    }
  };

  // -------------------------
  // RENDER
  // -------------------------
  return (
  <div className="max-w-[540px] mx-auto space-y-4">
    <button
      onClick={handleViewAllPosts}
      className="flex items-center gap-2 text-sm font-medium text-navy hover:text-oxblood transition-colors"
    >
      <ArrowLeft size={16} />
      View all posts
    </button>

    <VideoSoundProvider>
      <PostCard
        post={{ ...postData, currentUserId: userData?._id }}
        handleLike={handleLike}
        loadComments={loadComments}
        addComment={addComment}
        deleteComment={deleteComment}
        hideEdit
        handleDeletePost={handleDeletePost}
      />
    </VideoSoundProvider>
  </div>
);
}