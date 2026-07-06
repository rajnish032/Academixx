import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";

export default function EditPostModal({
  isOpen,
  closeModal,
  editText,
  setEditText,
  editTag,
  setEditTag,
  editFile,
  setEditFile,
  handleUpdate,
  TAG_OPTIONS,
  post,
  editPostLoading,
}) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!editFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(editFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [editFile]);

  if (!isOpen) return null;

  return (
  <div className="fixed inset-0 z-40 flex items-center justify-center bg-navy/50 px-3">
    {/* MODAL */}
    <div className="w-full max-w-xl h-[80vh] bg-paper-alt border border-navy flex flex-col">

      {/* HEADER */}
      <div className="flex items-center justify-between p-5 border-b border-brass/30">
        <div>
          <p className="font-meta text-[10px] uppercase text-oxblood mb-1">
            Revision
          </p>
          <h2 className="font-display font-semibold text-lg text-navy">
            Edit Post
          </h2>
        </div>
        <button
          disabled={editPostLoading}
          onClick={closeModal}
          className="p-2 hover:bg-paper transition-colors"
        >
          <X className="w-5 h-5 text-muted" />
        </button>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 hide-scrollbar">

        {/* TEXTAREA */}
        <textarea
          rows={4}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          placeholder="Update your thoughts…"
          className="font-body w-full resize-none border border-brass/50 bg-transparent px-4 py-3 text-ink placeholder-faint focus:outline-none focus:border-oxblood transition-colors"
        />

        {/* CHANGE MEDIA */}
        <label className="flex items-center justify-center gap-2 border border-dashed border-brass/60 px-4 py-3 text-muted cursor-pointer hover:border-oxblood hover:text-oxblood transition-colors">
          <Upload className="w-4 h-4" />
          <span className="font-meta text-[11px] uppercase">Change Media</span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setEditFile(file);
            }}
          />
        </label>

        {/* MEDIA PREVIEW */}
        {editFile && (
          <div className="border border-brass/40 h-fit overflow-y-auto hide-scrollbar">
            {editFile.type.startsWith("image/") && (
              <img src={previewUrl} alt="preview" className="w-auto object-contain" />
            )}

            {editFile.type.startsWith("video/") && (
              <video src={previewUrl} controls className="w-full object-contain" />
            )}

            {editFile.type === "application/pdf" && (
              <embed src={previewUrl} type="application/pdf" className="w-full h-[45vh]" />
            )}
          </div>
        )}
      </div>

      {/* FIXED ACTIONS */}
      <div className="sticky bottom-0 p-4 bg-paper-alt border-t border-brass/30 flex justify-end gap-3">
        <button
          disabled={editPostLoading}
          onClick={closeModal}
          className="font-meta text-[11px] uppercase px-4 py-2 text-muted hover:bg-paper transition-colors"
        >
          Cancel
        </button>

        <button
          disabled={editPostLoading}
          onClick={handleUpdate}
          className="font-meta text-[11px] uppercase px-6 py-2 bg-oxblood text-paper hover:bg-[#5F2323] transition-colors disabled:opacity-50"
        >
          {editPostLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  </div>
);
}