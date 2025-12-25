import { Router } from "express";
import { authentication } from "../../Middlewares/authentication.middleware";
import { TokenTypeEnum } from "../../Utils/Security/token";
import { RoleEnum } from "../../DB/Models/user.model";
import userService from "./user.service";
import { validation } from "../../Middlewares/validation.middleware";
import { logoutSchema } from "./user.validation";
const router: Router = Router();

router.get(
  "/profile",
  authentication({
    tokenType: TokenTypeEnum.access,
    accessRoles: [RoleEnum.user],
  }),
  userService.getProfile
);
router.post(
  "/logout",
  authentication({
    tokenType: TokenTypeEnum.access,
    accessRoles: [RoleEnum.user],
  }),
  validation(logoutSchema),
  userService.logout
);
router.post(
  "/refresh-token",
  authentication({
    tokenType: TokenTypeEnum.refresh,
    accessRoles: [RoleEnum.user , RoleEnum.admin],
  }),
  userService.refreshToken
);

export default router;
