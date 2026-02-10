import express, { Router } from "express";
import AuthControllers from "../controllers/userController";
const router:Router = express.Router();

router.route("/register")
.post(AuthControllers.registerUser)


export default router; 