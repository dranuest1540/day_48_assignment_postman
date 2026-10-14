import express from "express";
import productController from "../controllers/product.controller.js";
import authenticate from "../middleware/auth.middleware.js";

export const createProductRouter = (controller = productController) => {
    const router = express.Router();

    router.get("/", controller.getAllProducts);
    router.get("/:id", controller.getProductById);
    router.post("/", authenticate, controller.createProduct);
    router.put("/:id", authenticate, controller.updateProduct(false));
    router.patch("/:id", authenticate, controller.updateProduct(true));
    router.delete("/:id", authenticate, controller.deleteProduct);

    return router;
};

export default createProductRouter();