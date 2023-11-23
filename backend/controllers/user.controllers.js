import User from "../models/User.js";
import asyncHandler from "../middleware/asyncHandler.js";
import sendToken from "../utils/sendToken.js";

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const authUser = asyncHandler(async (req, res, next) => {
  const { email: enteredEmail, password } = req.body;

  const user = await User.findOne({
    email: enteredEmail,
  });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  sendToken(res, user);
});

// @desc    Register user
// @route   POST /api/users
// @access  Public
export const registerUser = asyncHandler(async (req, res, next) => {
  const { email, name, password } = req.body;
  const user = await User.create({ email, name, password });
  sendToken(res, user);
});

// @desc    Logout user & clear cookie
// @route   POST /api/users/logout
// @access  Private
export const logoutUser = (req, res, next) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ success: true, data: "Logged out" });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res, next) => {
  const { _id, name, email, isAdmin } = await User.findById(req.user._id);
  if (!_id) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json({
    success: true,
    user: { _id, name, email, isAdmin },
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.password) {
    user.password = req.body.password;
  }
  const { _id, name, email, isAdmin } = await user.save();
  res.status(200).json({
    success: true,
    user: { _id, name, email, isAdmin },
  });
});

// @desc    Get users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res, next) => {
  res.send("Get users");
});

// @desc    Get users by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res, next) => {
  res.send("Get user by ID");
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUsers = asyncHandler(async (req, res, next) => {
  res.send("Delete user by Admin");
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res, next) => {
  res.send("Update user by Admin");
});
