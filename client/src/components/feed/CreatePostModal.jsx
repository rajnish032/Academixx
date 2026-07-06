import  { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { assets } from "../../assets/assets";

export default function CreatePostModal({
  isOpen,
  closeModal,
  newPost,
  setNewPost,
  selectedTag,
  setSelectedTag,
  file,
  setFile,
  handlePost,
  TAG_OPTIONS,
  currentUser,
  posting
}) {
  const [previewUrl, setPreviewUrl] = useState(null);

  // Prevent video flicker
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!isOpen) return null;

  return (
  <div className="fixed inset-0 z-[60] flex items-start min-h-screen w-screen overflow-hidden justify-center bg-navy/50 pt-20 md:pt-24">
    {/* Modal */}
    <div className="w-full max-w-xl max-h-[80vh] flex flex-col overflow-hidden border border-navy bg-paper-alt text-ink">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-brass/30">
        <div>
          <p className="font-meta text-[10px] uppercase text-oxblood mb-1">
            New Entry
          </p>
          <h2 className="font-display font-semibold text-lg text-navy">
            Create a Post
          </h2>
        </div>
        <button
          onClick={closeModal}
          className="text-xl text-muted hover:text-oxblood transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {/* User */}
        <div className="flex items-center gap-3">
          <img
            src={currentUser?.avatar || assets.profile}
            className="w-14 h-14 object-cover border border-brass/50"
            alt="avatar"
          />
          <div className="flex flex-col items-start">
            <div className="font-body font-semibold text-ink">{currentUser?.fullName}</div>

            {/* Tag */}
            <div className="flex items-center gap-2 mt-1">
              <span className="font-meta text-[11px] uppercase text-muted">
                Show posts for
              </span>

              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="font-body bg-transparent text-sm font-semibold text-oxblood focus:outline-none cursor-pointer border-b border-brass/50"
              >
                {TAG_OPTIONS.map((tag) => (
                  <option key={tag} value={tag} className="bg-paper-alt text-ink">
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Textarea */}
        <textarea
          rows="4"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What do you want to talk about?"
          className="font-body w-full resize-none border border-brass/50 bg-transparent p-3 text-ink placeholder-faint focus:outline-none focus:border-oxblood transition-colors"
        />

        {/* Upload */}
        <label className="flex items-center gap-2 cursor-pointer text-oxblood hover:text-[#5F2323] transition-colors">
          <Upload className="w-4 h-4" />
          <span className="font-meta text-[11px] uppercase">Select Media</span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setFile(file);
            }}
          />
        </label>

        {/* Media Preview */}
        {file && previewUrl && (
          <div className="border border-brass/40 bg-paper p-2">
            {file.type.startsWith("image/") && (
              <img
                src={previewUrl}
                alt="preview"
                className="mx-auto max-h-[50vh] w-full object-contain"
              />
            )}

            {file.type.startsWith("video/") && (
              <video
                src={previewUrl}
                controls
                className="mx-auto max-h-[50vh] w-full object-contain"
              />
            )}

            {file.type === "application/pdf" && (
              <embed src={previewUrl} type="application/pdf" className="w-full h-[50vh]" />
            )}
          </div>
        )}
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 px-5 py-4 border-t border-brass/30 bg-paper-alt flex justify-end">
        <button
          disabled={posting}
          onClick={() => {
            handlePost();
          }}
          className="font-meta text-[11px] uppercase bg-oxblood px-6 py-2.5 text-paper hover:bg-[#5F2323] transition-colors disabled:opacity-50"
        >
          {posting ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  </div>
);
}