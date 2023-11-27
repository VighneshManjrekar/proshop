import Product from "../models/Product.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({ success: true, products });
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
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.status(200).json({ success: true });
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

  product.rating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) /
    product.reviews.length;

  await product.save();

  res.status(200).json({ success: true, review });
});
