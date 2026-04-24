import { uploadToCloudinary } from "../utills/cloudinary.js";
import Blog from "../models/blog.js";
import blogService from "../services/blogservices.js";
import { AppError } from "../utills/errorHandler.js";
import User from "../models/user.js";

// ─── Helper: Category ID validate karo ───────────────────────
const normalizeCategoryId = (id) => {
  if (!id) return null;
  const idStr = String(id).trim();
  if (idStr.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(idStr)) {
    throw new AppError(
      "Invalid category ID format. Must be a 24-character hexadecimal string.",
      400,
    );
  }
  return idStr.toLowerCase();
};

// ─── Helper: Tags parse karo (string ya array dono handle) ───
const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map((t) => t.trim()).filter(Boolean);
  if (typeof tags === "string") {
    try {
      return JSON.parse(tags)
        .map((t) => t.trim())
        .filter(Boolean);
    } catch {
      return tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
  }
  return [];
};

// ─────────────────────────────────────────────────────────────
// ADMIN STATS — total users + total blogs
// GET /blogs/admin/stats
// ─────────────────────────────────────────────────────────────
const getAdminStaticsOfUserBlog = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments({ isDeleted: false });

    res.status(200).json({
      success: true,
      stats: { totalUsers, totalBlogs },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// GET ALL BLOGS — public, with filters + pagination
// GET /blogs?search=&tag=&category=&page=&limit=
// ─────────────────────────────────────────────────────────────
const getAllBlogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // FIX: category filter add kiya + blogService ko query pass ki
    const query = {
      search: req.query.search || "",
      tag: req.query.tag || "",
      category: req.query.category || "", // ← pehle missing tha
      page,
      limit,
    };

    const { blogs, count } = await blogService.getAllBlogs(query);

    res.status(200).json({
      success: true,
      count,
      blogs,
      pagination: {
        current: page,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// GET SINGLE BLOG
// GET /blogs/:id
// ─────────────────────────────────────────────────────────────
const getBlogById = async (req, res, next) => {
  try {
    const blog = await blogService.getBlogById(req.params.id);
    if (!blog) return next(new AppError("Blog not found", 404));

    res.status(200).json({ success: true, blog });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// CREATE BLOG 
// POST /blogs
// ─────────────────────────────────────────────────────────────
const createBlog = async (req, res, next) => {
  try {
    const { title, content, tags, category } = req.body;

    if (!title || !content) {
      return next(new AppError("Title and content are required", 400));
    }

    const normalizedCategory = normalizeCategoryId(category);

    const blogData = {
      title: title.trim(),
      content: content.trim(),
      tags: parseTags(tags),
      author: req.user.id,
      ...(normalizedCategory && { category: normalizedCategory }),
    };

    // Cloudinary image upload
    if (req.file) {
      console.log("file received",req.file.path)
      const uploaded = await uploadToCloudinary(req.file.path);
      console.log("Cloudinary Response:", uploaded); 
      blogData.coverImage =
      typeof uploaded==="string" ?uploaded :uploaded.url;


    }
    else{
      console.log("no file uploaded")
    }

    const blog = await blogService.createBlog(blogData);
    res.status(201).json({ success: true, blog });
  } 
  catch (err) {
    console.log("create blog error",err)
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// UPDATE BLOG (Admin only)
// PUT /blogs/:id
// ─────────────────────────────────────────────────────────────
const updateBlog = async (req, res, next) => {
  try {
    const { title, content, tags, category } = req.body;

    // Pehle blog fetch karo — authorization check ke liye
    const blog = await Blog.findById(req.params.id);
    if (!blog) return next(new AppError("Blog not found", 404));

    if (blog.author.toString() !== req.user.id) {
      return next(new AppError("You can only update your own blogs", 403));
    }

    const normalizedCategory = normalizeCategoryId(category);
    const parsedTags = parseTags(tags);

    const blogData = {};
    if (title) blogData.title = title.trim();
    if (content) blogData.content = content.trim();
    if (parsedTags.length) blogData.tags = parsedTags;
    if (normalizedCategory) blogData.category = normalizedCategory;

    // Nayi image upload hui hai to replace karo
    if (req.file) {
      blogData.coverImage = await uploadToCloudinary(req.file.path);
    }

    const updatedBlog = await blogService.updateBlog(req.params.id, blogData);
    res.status(200).json({ success: true, blog: updatedBlog });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE BLOG — soft delete (Admin only)
// DELETE /blogs/:id
// ─────────────────────────────────────────────────────────────
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return next(new AppError("Blog not found", 404));

    if (blog.author.toString() !== req.user.id) {
      return next(new AppError("You can only delete your own blogs", 403));
    }

    await blogService.deleteBlog(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getAdminStaticsOfUserBlog,
};
