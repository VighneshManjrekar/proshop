import { Router } from "express";
import { getProducts, getProduct } from "../controllers/product.controllers.js";
const router = Router();

router.get("/", getProducts);

router.get("/:id", getProduct);

export default router;
