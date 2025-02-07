import { Router } from "express";
import * as authController from'../controllers/authController';
import { loginSchema,registerSchema } from "../schemas/auth";
import { validateBody } from "../middleware/validation";
const router = Router();
router.post("/signup",validateBody(registerSchema) ,authController.SignUp);
router.post("/signin",validateBody(loginSchema) ,authController.SignIn);

export default router