import Blog from "../models/blog.js"

// get all blogs with search and filter

const getAllBlogs=async (query={})=>{
    const filter={};

    // search by title case insensitive

    if(query.search){
        filter.title={$regex:query.search,$options:"i"};
    }

    // filter by tag
    if(query.tag){
        filter.tags=query.tag;
    }

     const blogs=await Blog.find(filter)
     .populate("author","name email")
     .sort({createdAt:-1});

     return blogs;
}


// get the single blog by the id

const getBlogById=async (id)=>{
    const blog=await Blog.findById(id).populate("author","name email");
    return blog;
}

// create new blog
const createBlog=async (data)=>{
    const blog=await Blog.create(data);
    return blog;
}

// update existing blog

const updateBlog=async (id,data)=>{
    const blog=await Blog.findByIdAndUpdate(
        id,
        {...data},
        {new:true,runValidators:true}
    )
    return blog
}


// delete the blog

const deleteBlog=async (id)=>{
    const blog=await findByIdAndUpdate(
        id,
        {isDeleted:true},
        {new:true}
    )
    return blog
}

export default {getAllBlogs,getBlogById,createBlog,updateBlog,deleteBlog}