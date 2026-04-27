import { uploadToCloudinary } from "../utills/cloudinary.js";
import Blog from "../models/blog.js";
import blogService from "../services/blogservices.js";
import { AppError } from "../utills/errorHandler.js";
import User from "../models/user.js";
import Category from "../models/category.js";

//  Tags parse karo (string ya array dono handle)
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

// Category name se ID resolve karo 
const resolveCategoryId = async (categoryName, next) => {
  if (!categoryName) return undefined;

  const found = await Category.findOne({
    title: { $regex: new RegExp(`^${categoryName}$`, "i") },
  });

  if (!found) {
    return next(new AppError(`Category "${categoryName}" not found`, 404));
  }

  return found._id;
};


// ADMIN STATS
// GET /api/blogs/stats

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


// GET ALL BLOGS — public, with filters + pagination
// GET /api/blogs?search=&tag=&category=&page=&limit=

const getAllBlogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // category resolve
    let categoryId="";
    if(req.query.category){
      categoryId=await resolveCategoryId(req.query.category,next)
      if(!categoryId) return
    }

    const query = {
      search: req.query.search || "",
      tag: req.query.tag || "",
      category: categoryId || "",
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

// GET SINGLE BLOG
// GET /api/blogs/:id

const getBlogById = async (req, res, next) => {
  try {
    const blog = await blogService.getBlogById(req.params.id);
    if (!blog) return next(new AppError("Blog not found", 404));

    res.status(200).json({ success: true, blog });
  } catch (err) {
    next(err);
  }
};


// CREATE BLOG
// POST /api/blogs

const createBlog = async (req, res, next) => {
  try {
    const { title, content, tags, category } = req.body;

    if (!title || !content) {
      return next(new AppError("Title and content are required", 400));
    }

    // FIX: Category model se ID resolve karo — name se
    const categoryId = await resolveCategoryId(category, next);
    if (category && !categoryId) return;

    const blogData = {
      title: title.trim(),
      content: content.trim(),
      tags: parseTags(tags),
      author: req.user.id,
      ...(categoryId && { category: categoryId }),
    };

    // Cloudinary image upload
    if (req.file) {
      console.log("File received:", req.file.path);
      const uploaded = await uploadToCloudinary(req.file.path);
      console.log("Cloudinary response:", uploaded);
      blogData.coverImage =
        typeof uploaded === "string" ? uploaded : uploaded.url;
    } else {
      console.log("No file uploaded");
    }

    const blog = await blogService.createBlog(blogData);
    res.status(201).json({ success: true, blog });
  } catch (err) {
    console.log("createBlog error:", err);
    next(err);
  }
};


// UPDATE BLOG
// PUT /api/blogs/:id

const updateBlog = async (req, res, next) => {
  try {
    const { title, content, tags, category } = req.body;

    // Pehle blog fetch karo — authorization check ke liye
    const blog = await Blog.findById(req.params.id);
    if (!blog) return next(new AppError("Blog not found", 404));

    if (blog.author.toString() !== req.user.id) {
      return next(new AppError("You can only update your own blogs", 403));
    }

    // FIX: blogData pehle declare karo, phir category resolve karo
    const blogData = {};

    if (title) blogData.title = title.trim();
    if (content) blogData.content = content.trim();

    const parsedTags = parseTags(tags);
    if (parsedTags.length) blogData.tags = parsedTags;

    // FIX: Category spelling sahi kiya + blogData pehle declare tha
    if (category) {
      const categoryId = await resolveCategoryId(category, next);
      if (!categoryId) return; // next() already called
      blogData.category = categoryId;
    }

    // Nayi image upload hui hai to replace karo
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.path);
      blogData.coverImage =
        typeof uploaded === "string" ? uploaded : uploaded.url;
    }

    const updatedBlog = await blogService.updateBlog(req.params.id, blogData);
    res.status(200).json({ success: true, blog: updatedBlog });
  } catch (err) {
    next(err);
  }
};

// DELETE BLOG — soft delete
// DELETE /api/blogs/:id

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
