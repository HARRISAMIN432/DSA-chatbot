import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";

export const autheticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return next(new ErrorHandler("Unauthorized", 403));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    console.log(decoded);
    if (!user) return next(new ErrorHandler("Unauthorized", 403));
    req.user = user;
    next();
  } catch (e) {
    next(new ErrorHandler(e.message, 500));
  }
};
