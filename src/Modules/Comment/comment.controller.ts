import { Router } from "express";
import CommentService from "./comment.service";
import { authentication } from "../../Middlewares/authentication.middleware";
import { TokenTypeEnum } from "../../Utils/Security/token";
import { RoleEnum } from "../../DB/Models/user.model";
import { validation } from "../../Middlewares/validation.middleware";
import { createCommentSchema } from "./comment.validation";
import {
  cloudFileUpload,
  fileValidation,
  StorageEnum,
} from "../../Utils/Multer/cloud.multer";
const router: Router = Router({ mergeParams: true });

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
  }).array("attachments", 2),
  validation(createCommentSchema),
  CommentService.createComment,
);

export default router;
