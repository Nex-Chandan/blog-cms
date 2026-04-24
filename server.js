import express from "express";
import dotenv from "dotenv"
dotenv.config();

import connectDb from "./config/db.js";
import blogRoutes from "./routes/blogRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import cors from "cors";


const app = express();
const PORT=process.env.PORT||8000;

//cors implementation
app.use(cors({
  origin: '*', 
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// db
connectDb();

// Middleware
app.use(express.json());

// Routes
app.use("/api/blogs",blogRoutes)
app.use("/api/auth",authRoutes)
app.use("/api/categories", categoryRoutes);

// Server start
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});