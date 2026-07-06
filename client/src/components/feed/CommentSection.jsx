import { useState } from "react";
import { Trash, Send } from "lucide-react";
import { assets } from "../../assets/assets";

export default function CommentSection({
  post,
  loadComments,
  addComment,
  deleteComment,
}) {
  const [commentText, setCommentText] = useState("");

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    addComment(post._id, commentText);
    setCommentText("");
  };

  const handleToggleLoad = () => {
    if (!post.comments) {
      loadComments(post._id);
    }
  };

  return (
  <div className="mt-4 space-y-3">
    {/* ADD COMMENT */}
    <div className="flex items-center gap-2">
      <input
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write a comment..."
        className="font-body flex-1 border border-brass/50 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-oxblood transition-colors"
        onFocus={handleToggleLoad}
      />
      <button
        onClick={handleAddComment}
        className="text-oxblood hover:text-[#5F2323] transition-colors"
      >
        <Send size={18} />
      </button>
    </div>

    {/* COMMENTS LIST */}
    <div className="space-y-3">
      {post.comments?.map((c) => {
        const canDelete =
          c.authorId === post.currentUserId || post.authorId === post.currentUserId;

        return (
          <div key={c._id} className="flex items-start gap-3 text-sm">
            <img
              src={c.authorSnapshot?.avatar || assets.profile}
              alt="avatar"
              className="w-8 h-8 object-cover border border-brass/50"
            />

            <div className="flex-1 bg-paper border border-brass/30 px-3 py-2">
              <div className="flex justify-between items-start">
                {/* <a
                  rel="noopener"
                  target="_blank"
                  href={`/profile/${c?.authorSnapshot?.uniqueId}`}
                > */}
                  <p className="font-body font-semibold text-ink">
                    {c.authorSnapshot.fullName}
                  </p>
                {/* </a> */}

                {canDelete && (
                  <Trash
                    size={14}
                    className="cursor-pointer text-oxblood/70 hover:text-oxblood transition-colors"
                    onClick={() => deleteComment(post._id, c._id)}
                  />
                )}
              </div>

              <p className="font-body text-ink/80 mt-1">{c.text}</p>
            </div>
          </div>
        );
      })}

      {!post.comments?.length && (
        <p className="font-body text-xs text-muted text-center py-2">
          No comments yet
        </p>
      )}
    </div>
  </div>
);
}
