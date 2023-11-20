import express from "express";
import products from "./data/products.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

// connect mongoDB
connectDB();

app.get("/", (req, res) => res.send("Server Running"));

app.get("/api/products", (req, res) => res.json({ success: true, products }));

app.get("/api/products/:id", (req, res) => {
  const product = products.find((prod) => prod._id === req.params.id);
  if (!product) {
    return res
      .status(404)
      .json({ success: false, product: "Product not found" });
  }
  res.json({ success: true, product });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}/`)
);
