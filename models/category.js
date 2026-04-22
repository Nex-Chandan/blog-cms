import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  id: {
    type: String,
  },
  title: {
    type: String,
  },
});

export default mongoose.model("Category", categorySchema);