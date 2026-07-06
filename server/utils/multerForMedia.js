import multer from "multer";

const storage = multer.memoryStorage();

const uploadMedia = multer({
  storage,
  limits: {
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const type = file.mimetype;

    const isImage = type.startsWith("image/");
    const isVideo = type.startsWith("video/");
    const isPDF =
      type === "application/pdf" || type.endsWith("+pdf");

    if (isImage || isVideo || isPDF) {
      return cb(null, true);
    }

    // silently reject unsupported file
    cb(null, false);
  },
});

/**
 * This middleware must safely handle:
 * - No file (text-only post)
 * - Valid file
 * - Invalid size
 */
export const validateMedia = (req, res, next) => {
  // ✅ no file → valid case → move on
  if (!req.file) {
    return next();
  }

  const { mimetype, size } = req.file;
  const fileSizeMB = size / (1024 * 1024);

  const isImage = mimetype.startsWith("image/");
  const isVideo = mimetype.startsWith("video/");
  const isPDF =
    mimetype === "application/pdf" || mimetype.endsWith("+pdf");

  if ((isImage || isPDF) && fileSizeMB > 10) {
    return res.status(400).json({
      success: false,
      message: "Images and PDFs must be 10MB or smaller",
    });
  }

  if (isVideo && fileSizeMB > 100) {
    return res.status(400).json({
      success: false,
      message: "Videos must be 100MB or smaller",
    });
  }

  return next();
};

export default uploadMedia;