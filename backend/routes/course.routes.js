import express from "express";
import courseController from "../controllers/course.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", courseController.getAllCourses);
router.get("/:id", courseController.getCourseById);
router.post("/", authenticate, authorize("instructor"), courseController.createCourse);
router.put("/:id", authenticate, authorize("instructor"), courseController.updateCourse);
router.delete("/:id", authenticate, authorize("instructor"), courseController.deleteCourse);

export default router;