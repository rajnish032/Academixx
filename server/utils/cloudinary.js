import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});


export const uploadPostMediaToCloudinary = async (file) => {
  if (!file || !file.buffer) {
    throw new Error("Invalid file input. Ensure 'file.buffer' is provided.");
  }

  let resourceType = "auto";

  if (file.mimetype.startsWith("image/")) {
    resourceType = "image";
  } else if (file.mimetype.startsWith("video/")) {
    resourceType = "video";
  } else if (file.mimetype === "application/pdf") {
    resourceType = "raw";
  }

  let transformation = [];

  if (resourceType === "image") {
    transformation = [
      {
        width: 536,
        crop: "limit",
        quality: "auto:best",
        fetch_format: "webp",
      },
    ];
  } else if (resourceType === "video") {
    transformation = [
      {
        width: 536,
        crop: "limit",
        quality: "auto:good",
        fetch_format: "mp4",
        video_codec: "h265",
      },
    ];
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        transformation,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(file.buffer);
  });
};


export const deleteFileFromCloudinary = async (fileUrl) => {
  try {
    if (!fileUrl || !fileUrl.includes("/upload/")) {
      throw new Error("Invalid Cloudinary URL format");
    }

    const url = fileUrl.split("/");
    const publicId = url.pop().split(".")[0];

    const result = await cloudinary.uploader.destroy(publicId);

    return result;
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error.message);
    throw error;
  }
};

export default cloudinary;
