import { Router } from "express";
import { getProducts, getProduct } from "../controllers/product.controllers.js";
const router = Router();

router.route("/").get(getProducts);
router.route("/:id").get(getProduct);

export default router;
