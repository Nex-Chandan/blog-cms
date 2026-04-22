import express from "express";
import dotenv from "dotenv"
import connectDb from "./config/db.js";
import blogRoutes from "./routes/blogRoutes.js"
import authRoutes from "./routes/authRoutes.js"
dotenv.config();

const app = express();
const PORT=8000;

// db
connectDb();

// Middleware
app.use(express.json());

// Routes
app.use("api/blogs",blogRoutes)
app.use("/api/auth",authRoutes)

// Server start
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});