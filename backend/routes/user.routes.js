import { Router } from "express";

const router = Router();

import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUsers,
  updateUser,
} from "../controllers/user.controllers.js";

import { protect, admin } from "../middleware/authHandler.js";

router.route("/").post(registerUser).get(protect, admin, getUsers);
router.post("/logout", protect, logoutUser);
router.post("/login", authUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route("/:id")
  .delete(protect, admin, deleteUsers)
  .put(protect, admin, updateUser)
  .get(protect, admin, getUserById);

export default router;
