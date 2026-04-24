import  express from "express";
const router = express.Router();
import {
  getAllCategories,
  createCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import authMiddleware from "../middleware/authmiddleware.js";
import { adminOnly } from "../middleware/adminmiddleware.js";

router.get("/", getAllCategories);                          // Public
router.post("/", authMiddleware,  createCategory);       // Admin
router.delete("/:id", authMiddleware, adminOnly, deleteCategory);       // Admin
  
export default router