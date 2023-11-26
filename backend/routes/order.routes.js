import { Router } from "express";

const router = Router();

import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getAllOrders,
} from "../controllers/order.controllers.js";

import { protect, admin } from "../middleware/authHandler.js";

router
  .route("/")
  .post(protect, addOrderItems)
  .get(protect, admin, getAllOrders); // admin
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/pay", protect, updateOrderToPaid);
router.put("/:id/deliver", protect, admin, updateOrderToDelivered); // admin

export default router;
