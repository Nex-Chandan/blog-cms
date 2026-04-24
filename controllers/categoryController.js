import  Category from "../models/category.js";
import { AppError }  from "../utills/errorHandler.js";

// GET /categories — sabhi categories
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ title: 1 });
    res.status(200).json({ success: true, categories });
  } catch (err) {
    next(err);
  }
};

// POST /categories — nayi category banao (Admin)
const createCategory = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) return next(new AppError("Title is required", 400));

    const category = await Category.create({ title });
    res.status(201).json({ success: true, category });
  } catch (err) {
    next(err);
  }
};

// DELETE /categories/:id — category delete karo (Admin)
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return next(new AppError("Category not found", 404));

    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (err) {
    next(err);
  }
};

export { getAllCategories, createCategory, deleteCategory };