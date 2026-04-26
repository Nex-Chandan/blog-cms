import User from "../models/user.js";
import category from "../models/category.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// generate JWT
const generateToken = (id,role,categoryTitle) => {
  return jwt.sign({ id ,role,categoryTitle}, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be 8 characters" });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await bcrypt.compare(password, user.password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      return res
        .status(401)
        .json({ message: "Invalid email or password" });
    }


    // email +password dono match karo admin


    const isAdmin= 
    email.toLowerCase()==="admin@blog.com"&& password==="blogcms@123";
    const role=isAdmin ? "admin":"user"
    const token=generateToken(user._id,role)

    return res.status(200).json({
      success:true,
      token,
      user:{
        id: user._id,
        name:user.name,
        email:user.email,
        role,
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get profile (protected route)
export const getProfile = async (req, res) => {

try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .select("-password -refreshToken");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      success: true,
      user,
    });

  }
  catch (err) {
    next(err);
  }
};


