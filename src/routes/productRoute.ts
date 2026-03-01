import express,{ Router } from "express";
import authMiddlerware, { Role } from "../middleware/authMiddlerware";
import productController from "../controllers/productController";
import {multer, storage} from "../middleware/multerMiddleware"


const upload = multer({storage : storage})
const router:Router = express.Router()

router.route("/")
.post(
authMiddlerware.isAuthenticated, 
authMiddlerware.restrictTo(Role.Admin), 
upload.single("image"), 
productController.addProduct)
.get(productController.getAllProducts)

router.route("/:id").get(productController.getSingleProduct)
.delete(authMiddlerware.isAuthenticated, authMiddlerware.restrictTo(Role.Admin), 
productController.deleteProduct)

export default router