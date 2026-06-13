import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { login, me, signup } from "./auth.controller.js";
import { loginSchema, signupSchema } from "./auth.schema.js";

const router = Router();

// Routes definitions
router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.get("/me", authMiddleware, me);

export default router;
