import express from "express"
import authmiddleware from "../middleware/authmiddleware.js"
import { createBlog,getAllBlogs,updateBlog,deleteBlog,getAdminStaticsOfUserBlog } from "../controllers/blogController.js"
import { adminOnly } from "../middleware/adminmiddleware.js"
import { upload } from "../utills/cloudinary.js"


const router=express.Router();


// public routes
router.get("/:id",getAllBlogs)


// admin +user common routes
router.post("/",authmiddleware,upload.single("coverImage"),createBlog)
router.put("/:id",authmiddleware,upload.single("coverImage"),updateBlog)
router.delete("/:id",authmiddleware,deleteBlog)

// admin only routes

router.get("/stats",authmiddleware,adminOnly,getAdminStaticsOfUserBlog)


export default router

