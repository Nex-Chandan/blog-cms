import express from "express"
import authmiddleware from "../middleware/authmiddleware.js"
import { createBlog,getAllBlogs,updateBlog,deleteBlog } from "../controllers/blogController.js";
import { adminOnly } from "../middleware/adminmiddleware.js";


const router=express.Router();


// public routes
router.get("/:id",getAllBlogs)

router.post("/",authmiddleware,createBlog)

// admin routes

router.put("/:id",authmiddleware,adminOnly,updateBlog)
router.delete("/:id",authmiddleware,adminOnly,deleteBlog)


// category api
// router.get("/category/:name", getBlogsByCategory);

export default router

