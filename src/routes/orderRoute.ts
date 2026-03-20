import express,{ Router } from "express";
import authMiddlerware from "../middleware/authMiddlerware";
import errorHandler from "../services/catchAsyncError";
import orderController from "../controllers/orderController";
const router:Router = express.Router()

router.route('/').post(authMiddlerware.isAuthenticated, errorHandler(orderController.createOrder))



export default router