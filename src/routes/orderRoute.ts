import { OrderDetails } from './../types/orderTypes';
import express,{ Router } from "express";
import authMiddlerware, { Role } from "../middleware/authMiddlerware";
import errorHandler from "../services/catchAsyncError";
import orderController from "../controllers/orderController";
const router:Router = express.Router()

router.route('/').post(authMiddlerware.isAuthenticated, errorHandler(orderController.createOrder))
router.route('/verify').post(authMiddlerware.isAuthenticated,errorHandler(orderController.verifyTransaction))
router.route("/customer/").post(authMiddlerware.isAuthenticated,errorHandler(orderController.fetchMyOrders))

router.route("/customer/cancel/:id").patch(authMiddlerware.isAuthenticated, authMiddlerware.restrictTo(Role.Customer), 
errorHandler(orderController.cancelMyOrder)).get(authMiddlerware.isAuthenticated,errorHandler(orderController.fetchOrderDetails))
export default router