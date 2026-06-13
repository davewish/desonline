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

    // Determine the folder based on Multer's destination (e.g., 'thumbnails', 'videos', 'pdfs')
    const folder = file.destination
      ? path.basename(file.destination)
      : "videos";
    return `/uploads/${folder}/${file.filename}`;
  }

  async delete(fileUrl) {
    if (!fileUrl) return;

    // Allow deletion from any of our recognized local upload folders
    const isLocal =
      fileUrl.startsWith("/uploads/videos/") ||
      fileUrl.startsWith("/uploads/thumbnails/") ||
      fileUrl.startsWith("/uploads/pdfs/");

    if (!isLocal) {
      console.warn(
        `Attempted to delete non-local file or invalid URL: ${fileUrl}`,
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
      console.log(`Deleted local file: ${filePath}`);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.warn(
          `Attempted to delete non-existent local file: ${filePath}`,
        );
      } else {
        console.error(`Error deleting local file ${filePath}:`, error);
        throw new Error(`Failed to delete local file: ${error.message}`);
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

const mainProvider = getStorageProvider();
const localProvider = new LocalStorageProvider();

/**
 * Smart handler to route files to local storage and strings to the selected provider.
 * This prevents the "Failed to create" error when uploading thumbnails in YOUTUBE mode.
 */
const handleUpload = async (input) => {
  // If it's a Multer file object, use LocalStorage regardless of main provider
  if (
    input &&
    typeof input === "object" &&
    (input.fieldname || input.filename)
  ) {
    return localProvider.upload(input);
  }
  return mainProvider.upload(input);
};

export const storageService = {
  saveFile: handleUpload,
  saveVideo: handleUpload,
  deleteFile: async (url) => {
    await localProvider.delete(url);
    await mainProvider.delete(url);
  },
  deleteVideo: async (url) => {
    await localProvider.delete(url);
    await mainProvider.delete(url);
  },
};

export default storageService;
