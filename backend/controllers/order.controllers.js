import Order from "../models/Order.js";
import Product from "../models/Product.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { calcPrices } from "../utils/calcprice.js";
import { verifyPayPalPayment, checkIfNewTransaction } from "../utils/paypal.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = asyncHandler(async (req, res, next) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (orderItems && orderItems.length == 0) {
    res.status(400);
    throw new Error("No order items");
  }
  const itemsFromDB = await Product.find({
    _id: { $in: orderItems.map((x) => x._id) },
  });

  const dbOrderItems = orderItems.map((itemFromClient) => {
    const matchingItemFromDB = itemsFromDB.find(
      (item) => item._id.toString() == itemFromClient._id
    );

    return {
      ...itemFromClient,
      product: itemFromClient._id,
      price: matchingItemFromDB.price,
      _id: undefined,
    };
  });

  const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
    calcPrices(dbOrderItems);

  const order = new Order({
    orderItems: dbOrderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });
  const createdOrder = await order.save();
  res.status(201).json({ success: true, order: createdOrder });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json({ success: true, orders });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "email name"
  );
  if (order) {
    res.status(200).json({ success: true, order });
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  // 1. Check if payment done
  // 2. Check if verified payment is used before for verification
  // 3. Check if correct amount is paid

  const { verified, value } = await verifyPayPalPayment(req.body.id);
  if (!verified) {
    res.status(400);
    throw new Error("Payment not verified");
  }

  const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
  if (!isNewTransaction) {
    res.status(400);
    throw new Error("Transaction has been used before");
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    order.status(404);
    throw new Error("Order not found");
  }
  const paidCorrectAmount = order.totalPrice.toString() == value;
  if (!paidCorrectAmount) {
    res.statu(401);
    throw new Error("Incorrect amount paid");
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.email_address,
  };

  const updatedOrder = await order.save();
  res.status(200).json({ success: true, data: updatedOrder });
});

// @desc    Update to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updatedOrder = await order.save();

  res.status(200).json({ success: true, order: updatedOrder });
});

// @desc    Get all orderes
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find().populate("user", "id name");
  res.status(200).json({ success: true, orders });
});
