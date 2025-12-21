import { Router } from "express";
import authService from "./auth.service";
import { validation } from "../../Middlewares/validation.middleware";
import {
  confirmEmailSchema,
  loginSchema,
  signupSchema,
} from "./auth.validation";
import { authentication } from "../../Middlewares/authentication.middleware";
import { RoleEnum } from "../../DB/Models/user.model";
const router: Router = Router();

router.post("/signup", validation(signupSchema), authService.signup);
router.post("/login", validation(loginSchema), authService.login);
router.patch(
  "/confirm-email",
  validation(confirmEmailSchema),
  authService.confirmEmail
);
router.post("/refresh-token", authService.refreshToken);
router.post(
  "/logout",
  authentication({ accessRoles: [RoleEnum.user, RoleEnum.admin] }),
  authService.logout
);

export default router;
