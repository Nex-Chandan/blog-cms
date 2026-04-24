import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type:     String,
      required: [true, "Title is required"],
      trim:     true,
    },

    content: {
      type:     String,
      required: [true, "Content is required"],
    },

    slug: {
      type:      String,
      unique:    true,
      lowercase: true,
    },

    coverImage: {
      type:    String,
      default: "",
    },

    author: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: [true, "Author is required"],
    },

    category: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "Category",
      required: [true, "Category is required"],
    },

    tags: {
      type:    [String],
      default: [],
    },

    isPublic: {
      type:    Boolean,
      default: true,
    },

    isDeleted: {
      type:    Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


export default mongoose.model("Blog", blogSchema);