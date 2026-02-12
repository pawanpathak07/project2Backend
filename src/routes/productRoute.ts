import express ,{ Router } from "express";
import ProductControllers from "../controllers/productController";
const router:Router = express.Router();

router.route("/addproduct")
.post(ProductControllers.addProduct)

export default router;