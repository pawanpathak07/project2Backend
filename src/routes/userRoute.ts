import express, { Router } from "express";
import AuthControllers from "../controllers/userController";
import errorHandler from "../services/catchAsyncError";
const router:Router = express.Router();

router.route("/register")
.post(errorHandler(AuthControllers.registerUser))

router.route("/login").post(errorHandler(AuthControllers.loginUser))

export default router; 