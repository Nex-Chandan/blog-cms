import Blog from "../models/blog.js";
import Category from "../models/category.js";
import { AppError } from "../utills/errorHandler.js";

// GET ALL BLOGS — filter + pagination

const getAllBlogs = async (query = {}) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;

  const filter = { isPublic: true, isDeleted: false };

  if (query.search) filter.title = { $regex: query.search, $options: "i" };
  if (query.tag) filter.tags = query.tag;
  if (query.category) filter.category = query.category;

  const [blogs, count] = await Promise.all([
    Blog.find(filter)
      .populate("author", "name email")
      .populate("category", "title")
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 }),
    Blog.countDocuments(filter),
  ]);

  return { blogs, count };
};

// GET SINGLE BLOG BY ID

const getBlogById = async (id) => {
  const blog = await Blog.findById(id)
    .populate("author", "name email")
    .populate("category", "title");
  return blog;
};

// CREATE BLOG

const createBlog = async (data) => {
  // Category exist karti hai ya nahi check karo
  if (data.category) {
    const category = await Category.findById(data.category);
    if (!category) throw new AppError("Category not found", 404);
  }

  const blog = await Blog.create(data);

  // Populated blog return karo
  return await Blog.findById(blog._id)
    .populate("author", "name email")
    .populate("category", "title");
};

// UPDATE BLOG

const updateBlog = async (id, data) => {
  if (data.category) {
    const category = await Category.findById(data.category);
    if (!category) throw new AppError("Category not found", 404);
  }

  const blog = await Blog.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("author", "name email")
    .populate("category", "title");

  return blog;
};

// DELETE BLOG — soft delete
const deleteBlog = async (id) => {
  const blog = await Blog.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return blog;
};

export default { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog };
