import { OrderDetails } from './../types/orderTypes';
import express,{ Router } from "express";
import authMiddlerware, { Role } from "../middleware/authMiddlerware";
import errorHandler from "../services/catchAsyncError";
import orderController from "../controllers/orderController";
const router:Router = express.Router()

router.route('/').post(authMiddlerware.isAuthenticated, errorHandler(orderController.createOrder))
router.route('/verify').post(authMiddlerware.isAuthenticated,errorHandler(orderController.verifyTransaction))
router.route("/customer/").get(authMiddlerware.isAuthenticated,errorHandler(orderController.fetchMyOrders))

router.route("/customer/:id").patch(authMiddlerware.isAuthenticated, authMiddlerware.restrictTo(Role.Customer), 
errorHandler(orderController.cancelMyOrder)).get(authMiddlerware.isAuthenticated,errorHandler(orderController.fetchOrderDetails))

router.route("/admin/payment/:id").patch(authMiddlerware.isAuthenticated, authMiddlerware.restrictTo(Role.Admin), 
errorHandler(orderController.changePaymentStatus))

router.route("/admin/:id").patch(authMiddlerware.isAuthenticated, authMiddlerware.restrictTo(Role.Admin), 
errorHandler(orderController.changeOrderStatus))
.delete(authMiddlerware.isAuthenticated, authMiddlerware.restrictTo(Role.Admin), errorHandler(orderController.deleteOrder))





export default router
