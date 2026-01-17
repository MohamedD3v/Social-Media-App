import { Router } from "express";
import postService from "./post.service";
import { authentication } from "../../Middlewares/authentication.middleware";
import { RoleEnum } from "../../DB/Models/user.model";
import { TokenTypeEnum } from "../../Utils/Security/token";
const router: Router = Router();
router.post(
  "/create-post",
  authentication({
    tokenType: TokenTypeEnum.access,
    accessRoles: [RoleEnum.user, RoleEnum.admin],
  }),
  postService.createPost
);

export default router;
