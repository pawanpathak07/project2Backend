import express,{ Router } from "express";
import authMiddlerware, { Role } from "../middleware/authMiddlerware";
import cartController from "../controllers/cartController";
const router:Router = express.Router()

router.route("/")
.post(authMiddlerware.isAuthenticated, cartController.addToCart)
.get(authMiddlerware.isAuthenticated, cartController.getMyCarts)

router.route("/:productId")
.patch(authMiddlerware.isAuthenticated, cartController.updateCartItem)
.delete(authMiddlerware.isAuthenticated, cartController.deleteMyCartItem)

export default router