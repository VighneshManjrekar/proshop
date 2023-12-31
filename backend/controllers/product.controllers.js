import path from "path";
import { unlinkSync } from "fs";
import Product from "../models/Product.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res, next) => {
  const pageSize = process.env.PAGINATION_LIMIT || 8;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};
  const count = await Product.countDocuments({ ...keyword });

  const skip =
    pageSize * (page - 1) >= count
      ? count - pageSize < 0
        ? 0
        : count - pageSize
      : pageSize * (page - 1);

  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(skip);

  res.status(200).json({
    success: true,
    products,
    pages: {
      total: Math.ceil(count / pageSize),
      current: page,
    },
  });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Resource not Found");
  }
  res.status(200).json({ success: true, product });
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res, next) => {
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample Brand",
    category: "Sample Category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample Description",
  });

  const createdProduct = await product.save();
  res.status(201).json({ success: true, product: createdProduct });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res, next) => {
  const { name, price, image, brand, category, countInStock, description } =
    req.body;

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Invalid Id\nProduct not found");
  }

  product.name = name;
  product.price = price;
  product.image = image;
  product.brand = brand;
  product.category = category;
  product.countInStock = countInStock;
  product.image = image;
  product.description = description;

  const updatedProduct = await product.save();
  res.status(200).json({ success: true, product: updatedProduct });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (process.env.NODE_ENV !== "development") {
    const isAdminProduct = [
      "6566321c94d4bf2ceced890d",
      "6566321c94d4bf2ceced890e",
      "6566321c94d4bf2ceced890f",
      "6566321c94d4bf2ceced8910",
      "6566321c94d4bf2ceced8911",
      "6566321c94d4bf2ceced8912",
    ].includes(req.params.id);
    if (isAdminProduct) {
      res.status(400);
      throw new Error("Cannot delete default admin products");
    }
  }
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  } else {
    const __dirname = path.resolve();
    if (product.image.startsWith("/uploads")) {
      unlinkSync(path.join(__dirname, product.image));
    }
    await Product.deleteOne({ _id: product._id });
    res.status(200).json({ success: true });
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;
  const user = req.user._id;
  const product = await Product.findById(req.params.id);

  // if product not exists
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const alreadyReviewed = product.reviews.find(
    (x) => x.user.toString() == user.toString()
  );

  // if user already reviewed the product
  if (alreadyReviewed) {
    res.status(400);
    throw new Error("Product already reviewed");
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;

  product.rating = Math.round(
    product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      product.reviews.length
  );

  await product.save();

  res.status(200).json({ success: true, review });
});

// @desc    Get top products
// @route   GET /api/products/top
// @access  Public
export const getTopProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.status(200).json({ success: true, products });
});
