import { Router } from "express";
import * as authController from'../controllers/authController';
import {login, register} from "../schemas/auth"
import { validateBody } from "../middleware/validation";


const router = Router();
router.post('/signup',validateBody(register), authController.signup);
router.post('/signin',validateBody(login), authController.signin);
router.post('/logout', authController.logout);


export default router