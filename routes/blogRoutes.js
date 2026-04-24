import express from "express";
import authmiddleware from "../middleware/authmiddleware.js";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getAdminStaticsOfUserBlog,
} from "../controllers/blogController.js";
import { adminOnly } from "../middleware/adminmiddleware.js";
import { upload } from "../utills/cloudinary.js";

const router = express.Router();

//  routes
router.get("/",getAllBlogs);
router.get("/:id", authmiddleware, getBlogById);

// admin routes
router.get("/stats", authmiddleware, adminOnly, getAdminStaticsOfUserBlog);

//  user+admin routes
router.post("/", authmiddleware, upload.single("image"), createBlog);
router.put("/:id", authmiddleware, upload.single("image"), updateBlog);
router.delete("/:id", authmiddleware, deleteBlog);

export default router;
