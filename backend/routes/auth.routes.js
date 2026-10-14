import express from "express";
import authController from "../controllers/auth.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const router = express.Router();

export const createAuthRouter = (controller = authController) => {
	const authRouter = express.Router();

	authRouter.post("/register", controller.register);
	authRouter.post("/login", controller.login);
	authRouter.get("/me", authenticate, controller.me);

	return authRouter;
};

router.use(createAuthRouter());

export default router;