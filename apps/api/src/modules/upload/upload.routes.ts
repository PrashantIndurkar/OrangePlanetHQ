import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { uploadImageHandler } from "./upload.controller.js";
import { uploadSingleImage } from "./upload.middleware.js";

const router = Router();

// Protect upload routes
router.use(authMiddleware);

// POST /api/v1/uploads/image
router.post("/image", uploadSingleImage, uploadImageHandler);

export default router;
