import express from "express";
import categoryController from "../controllers/category.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = express.Router();

// PUBLIC
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);

// ADMIN
router.post("/", authenticate, authorize("admin"), categoryController.createCategory);
router.put("/:id", authenticate, authorize("admin"), categoryController.updateCategory);
router.delete("/:id", authenticate, authorize("admin"), categoryController.deleteCategory);

export default router;