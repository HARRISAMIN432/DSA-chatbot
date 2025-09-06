import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/sendToken.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return next(new ErrorHandler("Empty fields are not allowed", 400));
    const isExist = await User.findOne({ email: email });
    if (isExist)
      return next(
        new ErrorHandler("The email already exists. Try a new email", 400)
      );
    const hashed = await bcrypt.hash(password, 8);
    const newUser = await User.create({
      username,
      email,
      password: hashed,
    });
    const token = sendToken(newUser);
    const { password: ignore, ...rest } = newUser._doc;
    res.status(201).json({
      success: true,
      ...rest,
      token,
    });
  } catch (e) {
    next(new ErrorHandler(e.message, 500));
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Email and password are required", 400));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
    const token = sendToken(user);
    const { password: ignore, ...rest } = user.toObject();
    res.status(200).json({
      success: true,
      ...rest,
      token,
    });
  } catch (e) {
    next(new ErrorHandler(e.message, 500));
  }
};
