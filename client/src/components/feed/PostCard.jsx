import { useRef, useEffect, useState } from "react";
import { Heart, MessageCircle, PenSquare, Trash, Volume2, VolumeX, X } from "lucide-react";
import { useVideoSound } from "../../context/VideoSoundContext";
import CommentSection from "./CommentSection";
import LikesOverlay from "./LikesOverlay";
import { FaShare } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import { assets } from "../../assets/assets";
export default function PostCard({
  post,
  handleLike,
  loadComments,
  openEdit,
  handleDeletePost,
  addComment,
  deleteComment,
  hideEdit = false
}) {
  const lastTap = useRef(0);
  const videoRef = useRef(null);
  const { muted, setMuted } = useVideoSound();
  const [showHeart, setShowHeart] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const textRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showShare, setShowShare] = useState(false);
  
  const shareUrl = `${window.location.origin}/feed/post/${post._id}`;

  const shareMessage = `Check this post on AerooTribe
A growing community for drone pilots, GIS experts & surveyors.

👇 Read it here`;

  useEffect(() => {
    if (!textRef.current) return;

    const el = textRef.current;
    setIsOverflowing(el.scrollHeight > el.clientHeight);
  }, [post.text, expanded]);




  /* ---------------- DOUBLE TAP LIKE ---------------- */
  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      handleLike(post._id);

      // Haptic feedback (mobile)
      if (navigator.vibrate) navigator.vibrate(30);

      // Floating heart
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 700);
    }
    lastTap.current = now;
  };

  /* ---------------- AUTOPLAY VIDEO ON VIEW ---------------- */
  useEffect(() => {
    if (!videoRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current.play().catch(() => { });
        } else {
          videoRef.current.pause();
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  /* ---------------- VIDEO PROGRESS ---------------- */
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const percent =
      (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(percent || 0);
  };

  // show text 
  const renderTextWithLinks = (text) => {
    if (!text) return null;

    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        let displayUrl = part;

        try {
          const url = new URL(part);
          displayUrl = url.hostname + (url.pathname !== "/" ? "/..." : "");
        } catch { }

        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline break-all"
          >
            {displayUrl}
          </a>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };


  return (
  <div className="mx-auto w-full max-w-[540px] bg-paper-alt border border-navy p-5">

    {/* HEADER */}
    <div className="flex justify-between">
      <div className="flex items-center gap-3">
        <img
          src={post?.authorSnapshot?.avatar || assets.profile}
          className="w-11 h-11 object-cover border border-brass/50"
          alt="avatar"
          draggable={false}
        />
        <div>
          {/* <a rel="noopener" target="_blank" href={`/profile/${post?.authorSnapshot?.uniqueId}`}> */}
            <p className="font-body font-semibold text-ink">
              {post?.authorSnapshot?.fullName}
            </p>
          {/* </a> */}
          <p className="font-meta text-xs text-oxblood">#{post.tag}</p>
        </div>
      </div>

      {!hideEdit && post?.authorId === post?.currentUserId && (
        <div className="flex items-center gap-3 text-xs">
          <PenSquare
            size={14}
            className="text-muted cursor-pointer hover:text-navy transition-colors"
            onClick={() => openEdit(post)}
          />
          <Trash
            size={14}
            className="text-oxblood/70 cursor-pointer hover:text-oxblood transition-colors"
            onClick={() => handleDeletePost(post?._id)}
          />
        </div>
      )}
    </div>

    {/* TEXT */}
    {post?.text && (
      <div className="mt-3">
        <p
          ref={textRef}
          className={`font-body text-ink/80 whitespace-pre-wrap break-words overflow-hidden transition-all ${
            expanded ? "" : "line-clamp-3"
          }`}
        >
          {renderTextWithLinks(post.text)}
        </p>

        {(isOverflowing || expanded) && (
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="mt-1 font-meta text-[11px] uppercase text-oxblood hover:underline"
          >
            {expanded ? "See less" : "See more"}
          </button>
        )}
      </div>
    )}

    {/* MEDIA */}
    {post?.mediaUrl && (
      <div
        className="relative mt-3 flex justify-center select-none"
        onClick={handleDoubleTap}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* FLOATING HEART */}
        {showHeart && (
          <Heart
            className="absolute z-10 text-oxblood fill-oxblood animate-ping"
            size={96}
          />
        )}

        {/* VIDEO */}
        {post.mediaType === "video" && (
          <>
            <video
              ref={videoRef}
              src={post.mediaUrl}
              muted={muted}
              loop
              playsInline
              controls={false}
              onTimeUpdate={handleTimeUpdate}
              className="md:max-h-[60vh] max-h-[55vh] border border-brass/40"
            />

            {/* PROGRESS BAR */}
            <div className="absolute bottom-2 left-2 right-2 h-1 bg-white/20">
              <div
                className="h-1 bg-oxblood"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* UNMUTE BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMuted((prev) => !prev);
              }}
              className="absolute top-3 right-3 bg-navy/70 p-2 text-paper"
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </>
        )}

        {/* IMAGE */}
        {post.mediaType === "image" && (
          <img
            src={post.mediaUrl}
            alt="post media"
            draggable={false}
            className="md:max-h-[60vh] max-h-[55vh] pointer-events-none border border-brass/40"
          />
        )}

        {/* PDF */}
        {post.mediaType === "pdf" && (
          <iframe
            src={post.mediaUrl}
            className="w-full h-[50vh] border border-brass/40"
            title="PDF Preview"
          />
        )}
      </div>
    )}

    {/* ACTIONS */}
    <div className="flex justify-between mt-4 pt-3 border-t border-brass/30">
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleLike(post._id)}
          className={post.likedByUser ? "text-oxblood" : "text-muted"}
        >
          <Heart size={20} className={post.likedByUser ? "fill-oxblood" : ""} />
        </button>

        <button
          onClick={() => setShowLikes(true)}
          className="font-meta text-[12px] text-navy hover:underline"
        >
          {post.likesCount + " Likes"}
        </button>

        <button
          onClick={() => {
            setShowComments((prev) => !prev);
            if (!post.comments) loadComments(post._id);
          }}
          className="flex ml-4 items-center gap-2 text-muted hover:text-navy transition-colors"
        >
          <MessageCircle size={20} />
          <span className="font-meta text-[12px]">
            {post.commentsCount ?? post.comments?.length ?? 0}
          </span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowShare(true)}
          className="text-muted flex items-center gap-1.5 hover:text-navy transition-colors"
        >
          <span className="font-meta text-[12px] uppercase">Share</span>
          <FaShare size={13} />
        </button>
      </div>
    </div>

    {showComments && (
      <CommentSection
        post={post}
        loadComments={loadComments}
        addComment={addComment}
        deleteComment={deleteComment}
      />
    )}
    {showLikes && (
      <LikesOverlay postId={post._id} onClose={() => setShowLikes(false)} />
    )}

    {/* Share Modal */}
    {showShare && (
      <div
        className="fixed inset-0 z-50 bg-navy/50 flex items-end mb-[43px] sm:mb-0 sm:items-center justify-center"
        onClick={() => setShowShare(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full sm:max-w-md bg-paper-alt text-ink border border-navy p-5"
        >
          {/* Title */}
          <p className="font-display font-semibold text-center text-navy mb-4">
            Share Post
          </p>

          {/* SHARE TEXT */}
          <div className="bg-paper border border-brass/30 p-3 mb-3 font-body text-sm text-ink/80 whitespace-pre-wrap">
            {shareMessage}
          </div>

          {/* SHARE LINK */}
          <div className="bg-paper border border-brass/30 p-2 font-meta text-xs text-oxblood break-all mb-5">
            {shareUrl}
          </div>

          {/* SHARE ACTIONS */}
          <div className="flex justify-around text-center items-end">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${shareMessage}\n${shareUrl}`)}`}
              target="_blank"
              className="flex flex-col items-center gap-1.5"
            >
              <span className="text-2xl text-green-600">
                <FaWhatsapp />
              </span>
              <span className="font-meta text-[10px] uppercase text-muted">WhatsApp</span>
            </a>

            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareMessage} ${shareUrl}`)}`}
              target="_blank"
              className="flex flex-col items-center gap-1.5"
            >
              <span className="text-2xl text-ink">
                <X />
              </span>
              <span className="font-meta text-[10px] uppercase text-muted">Twitter</span>
            </a>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              className="flex flex-col items-center gap-1.5"
            >
              <span className="text-2xl text-[#0A66C2]">
                <FaLinkedinIn />
              </span>
              <span className="font-meta text-[10px] uppercase text-muted">LinkedIn</span>
            </a>

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              className="flex flex-col items-center gap-1.5"
            >
              <span className="text-2xl text-[#1877F2]">
                <FaFacebookF />
              </span>
              <span className="font-meta text-[10px] uppercase text-muted">Facebook</span>
            </a>

            <button
              onClick={() => {
                navigator.clipboard.writeText(`${shareMessage}\n${shareUrl}`);
                toast.success("Copied to clipboard");
                setShowShare(false);
              }}
              className="flex flex-col items-center gap-1.5"
            >
              <span className="text-2xl text-navy">
                <FaRegCopy />
              </span>
              <span className="font-meta text-[10px] uppercase text-muted">Copy</span>
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}