import {AppError} from "../utills/errorHandler.js"

const adminOnly=(req,res,next)=>{
    if(req.user && req.user.role==="admin"){
        return next();
    }
    return next(new AppError("Access denied This is only for admin .only admin can access",403))
}

export{adminOnly}