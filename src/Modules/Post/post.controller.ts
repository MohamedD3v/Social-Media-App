import { Router } from "express";
import postService from "./post.service";
import { authentication } from "../../Middlewares/authentication.middleware";
import { RoleEnum } from "../../DB/Models/user.model";
import { TokenTypeEnum } from "../../Utils/Security/token";
import { validation } from "../../Middlewares/validation.middleware";
import { createPostSchema, likePostSchema } from "./post.validation";
import commentRouter from "../Comment/comment.controller";
import {
  cloudFileUpload,
  fileValidation,
  StorageEnum,
} from "../../Utils/Multer/cloud.multer";
const router: Router = Router();
router.use("/:postId/comment", commentRouter);
router.post(
  "/",
  authentication({
    tokenType: TokenTypeEnum.access,
    accessRoles: [RoleEnum.user, RoleEnum.admin],
  }),
  cloudFileUpload({
    validation: [...fileValidation.images],
    storageApproch: StorageEnum.memory,
    maxSizeMB: 3,
  }).array("attachments", 6),
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
