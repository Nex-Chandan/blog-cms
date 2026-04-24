import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import fs from "fs/promises";
import path from "path";

// config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// multer storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = "uploads/";
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// upload middleware
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, WEBP images allowed"));
    }
  }
});

// upload to cloudinary
export const uploadToCloudinary = async (localPath) => {
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      folder: "blog-cms",
      transformation: [{ width: 1200, quality: "auto" }]
    });

    await fs.unlink(localPath); // async delete

    return result.secure_url;
  } catch (error) {
    try {
      await fs.unlink(localPath);
    } catch {}

    throw new Error("Cloudinary upload failed");
  }
};