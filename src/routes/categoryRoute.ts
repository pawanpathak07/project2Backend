import express,{ Router } from "express";
import authMiddlerware, { Role } from "../middleware/authMiddlerware";
import categoryController from "../controllers/categoryController";
const router:Router = express.Router()

router.route("/")
.post(authMiddlerware.isAuthenticated, authMiddlerware.restrictTo(Role.Admin),categoryController.addCategory)
.get(categoryController.getCategories)

router.route("/:id")
.delete(authMiddlerware.isAuthenticated, authMiddlerware.restrictTo(Role.Admin), categoryController.deleteCategory)
.patch(authMiddlerware.isAuthenticated, authMiddlerware.restrictTo(Role.Admin), 
categoryController.updateCategory)

export default router