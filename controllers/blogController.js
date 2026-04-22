import { json } from "express";
import Blog from "../models/blog.js";
import blogService from "../services/blogservices.js"
import {AppError} from "../utills/errorHandler.js"




// get the public blogs

const getAllBlogs=async (req,res,next)=>{
    try{
        const blogs=await blogService.getAllBlogs(req.query);
        return res.status(200).json({success:true,count:blogs.length,blogs})
    }
    catch(err){
        next(err)
    }
}


// get the blog by 

const getBlogById=async (req,res,next)=>{
    try{
        const blog=await blogService.getBlogById(req.params.id);
        if(!blog)return next(new AppError("blog not found",404))
        res.status(200).json({success:true,blog})   
    }

    catch(err){
        next(err)
    }
}


// create blog
const createBlog = async (req, res, next) => {
  try {
    const { title, content, coverImage, tags,category} = req.body;

    if (!title || !content) {
      return next(new AppError("Title and content are required", 400));
    }

    const blog = await blogService.createBlog({
      title,
      content,
      coverImage,
      tags,
      author: req.user.id,
      category
    });

    res.status(201).json({
      success: true,
      blog,
    });
  } catch (err) {
    next(err);
  }
};


// update blog by id

const updateBlog=async (req,res,next)=>{
    try{
        const blog=await blogService.updateBlog(req.params.id,req.body);
        if(!blog) return next(new AppError("Blog not found",404))
        res.status(200).json({success:true,blog})    
    }
    catch(err){
        next(err);
    }
}



// delete the blog
const deleteBlog=async (req,res,next)=>{
    try{
    const blog=await blogService.deleteBlog(req.params.id);

    if(!blog)
        return next(new AppError("Blog not found",404));
    return res.status(200).json({success:true,message:"Blog deleted"})
    }

    catch(err){
        next(err)
    }

}

export {getAllBlogs,getBlogById,createBlog,updateBlog,deleteBlog}


