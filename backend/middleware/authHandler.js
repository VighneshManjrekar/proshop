import jwt from "jsonwebtoken";

import asyncHandler from "./asyncHandler.js";
import User from "../models/User.js";

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(userId).select("-password");
    next();
  } catch (error) {
    console.log(error);
    res.status(401);
    throw new Error("Invalid token");
  }
});

export const admin = (req, res, next) => {
  if (!req.user.isAdmin) {
    res.status(401);
    throw new Error("Not Authorized as admin");
  }
  next();
};
