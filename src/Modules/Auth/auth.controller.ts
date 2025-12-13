import { Router } from "express";
import authService from "./auth.service";
import { validation } from "../../Middlewares/validation.middleware";
import { loginSchema, signupSchema } from "./auth.validation";
const router: Router = Router();

router.get("/signup", validation(signupSchema), authService.signup);
router.get("/login", validation(loginSchema), authService.login);

export default router;
