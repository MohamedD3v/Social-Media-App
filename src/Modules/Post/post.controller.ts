import { Router } from "express";
import postService from "./post.service";
import { authentication } from "../../Middlewares/authentication.middleware";
import { RoleEnum } from "../../DB/Models/user.model";
import { TokenTypeEnum } from "../../Utils/Security/token";
import { validation } from "../../Middlewares/validation.middleware";
import { createPostSchema, likePostSchema } from "./post.validation";
const router: Router = Router();
router.post(
  "/",
  authentication({
    tokenType: TokenTypeEnum.access,
    accessRoles: [RoleEnum.user, RoleEnum.admin],
  }),
  validation(createPostSchema),
  postService.createPost,
);
router.patch(
  "/:postId/like",
  authentication({
    tokenType: TokenTypeEnum.access,
    accessRoles: [RoleEnum.user, RoleEnum.admin],
  }),
  validation(likePostSchema),
  postService.likePost,
);

router.get(
  "/get-posts",
  authentication({
    tokenType: TokenTypeEnum.access,
    accessRoles: [RoleEnum.user, RoleEnum.admin],
  }),
  postService.getPosts,
);

export default router;
