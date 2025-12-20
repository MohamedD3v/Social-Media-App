import { Router } from "express";
import { authentication } from "../../Middlewares/authentication.middleware";
import { TokenTypeEnum } from "../../Utils/Security/token";
import { RoleEnum } from "../../DB/Models/user.model";
import userService from "./user.service";
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
    tokenType: TokenTypeEnum.refresh,
    accessRoles: [RoleEnum.user],
  })
);

export default router;
