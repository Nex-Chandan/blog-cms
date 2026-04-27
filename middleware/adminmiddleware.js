import { AppError } from "../utills/errorHandler.js";

const adminOnly = (req, res, next) => {
    if (req.user && (req.user.role === "admin" || req.user.role === "Admin")) {
        return next();
    }
    return next(new AppError("Access denied. Only admin can access", 403));
};

export { adminOnly };