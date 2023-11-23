import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import productRouter from "./routes/product.routes.js";
import userRouter from "./routes/user.routes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const PORT = process.env.PORT || 7000;
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// connect mongoDB
connectDB();

app.get("/", (req, res) => res.send("Server Running"));
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}/`)
);
