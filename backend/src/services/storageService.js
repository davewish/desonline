import cloudinary from "cloudinary"; // Future use
import AWS from "aws-sdk"; // Future use
import path from "path";
import fs from "fs/promises"; // Use fs.promises for async operations
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * Clean Architecture: Storage Provider Strategy
 * This service allows you to switch between YouTube, Local,
 * Cloudinary, or AWS by changing an environment variable.
 */

class StorageProvider {
  async upload(file) {
    throw new Error("Method 'upload' must be implemented.");
  }
  async delete(fileUrl) {
    throw new Error("Method 'delete' must be implemented.");
  }
}

class LocalStorageProvider extends StorageProvider {
  async upload(file) {
    if (!file || !file.filename) {
      throw new Error("No file provided for local storage upload.");
    }
    // Multer already saved the file to its destination.
    // We return the URL that the frontend will use to access it.
    // Assuming Multer saves video files to `uploads/videos`
    return `/uploads/videos/${file.filename}`;
  }

  async delete(fileUrl) {
    if (!fileUrl || !fileUrl.startsWith("/uploads/videos/")) {
      console.warn(
        `Attempted to delete non-local video file or invalid URL: ${fileUrl}`,
      );
      return;
    }
    const filePath = path.join(
      __dirname,
      "../../uploads",
      fileUrl.replace("/uploads/", ""),
    );
    try {
      await fs.access(filePath); // Check if file exists
      await fs.unlink(filePath); // Delete the file
      console.log(`Deleted local video file: ${filePath}`);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.warn(
          `Attempted to delete non-existent local video file: ${filePath}`,
        );
      } else {
        console.error(`Error deleting local video file ${filePath}:`, error);
        throw new Error(`Failed to delete local video file: ${error.message}`);
      }
    }
  }
}

class YouTubeProvider extends StorageProvider {
  async upload(url) {
    // For YouTube, 'url' is just a string pasted by the admin.
    // We validate it and return it as the storage path.
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(url)) {
      throw new Error("Invalid YouTube URL");
    }
    return url;
  }
  async delete(url) {
    // No actual deletion needed for YouTube links, as they are external
    console.log(`No deletion action for YouTube URL: ${url}`);
  }
}

class CloudinaryProvider extends StorageProvider {
  async upload(file) {
    // Future implementation:
    // const result = await cloudinary.v2.uploader.upload(file.path);
    // return result.secure_url;
    return "Cloudinary integration pending";
  }
}

class S3Provider extends StorageProvider {
  async upload(file) {
    // Future implementation:
    // const result = await s3.upload({...}).promise();
    // return result.Location;
    return "AWS S3 integration pending";
  }
}

// Factory to determine which provider to use
const getStorageProvider = () => {
  const type = process.env.VIDEO_STORAGE_TYPE || "YOUTUBE";

  switch (type.toUpperCase()) {
    case "LOCAL":
      return new LocalStorageProvider();
    case "CLOUDINARY":
      return new CloudinaryProvider();
    case "AWS":
      return new S3Provider();
    case "YOUTUBE":
    default:
      return new YouTubeProvider();
  }
};

const provider = getStorageProvider();

export const storageService = {
  saveVideo: async (input) => provider.upload(input),
  deleteVideo: async (url) => provider.delete(url),
};

export default storageService;
