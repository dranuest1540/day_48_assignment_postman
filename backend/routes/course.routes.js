import express from "express";
import courseController from "../controllers/course.controller.js";

const router = express.Router();

router.get("/", courseController.getAllCourses);

export default router;