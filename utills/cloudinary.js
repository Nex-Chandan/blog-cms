import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv"
dotenv.config();
// config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("env checking loading", process.env.CLOUDINARY_API_KEY);

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
  },
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
      cb(new Error("Only JPEG, PNG, WEBP images allowed"));
    }
  },
});

// upload to cloudinary
export const uploadToCloudinary = async (localPath) => {
  try {
    const fixedPath = path.resolve(localPath);

    console.log("Uploading:", fixedPath);

    const result = await cloudinary.uploader.upload(fixedPath, {
      folder: "blog-cms",
      transformation: [{ width: 1200, quality: "auto" }],
    });

    await fs.unlink(fixedPath);

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("🔥 REAL Cloudinary ERROR:", error);

    try {
      await fs.unlink(localPath);
    } catch {}

    throw error; // ✅ IMPORTANT FIX
  }
};
