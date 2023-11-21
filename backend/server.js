import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import productRouter from "./routes/product.routes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 7000;

// connect mongoDB
connectDB();

app.get("/", (req, res) => res.send("Server Running"));
app.use("/api/products", productRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}/`)
);
