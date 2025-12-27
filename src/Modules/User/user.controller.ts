import { Router } from "express";
import { authentication } from "../../Middlewares/authentication.middleware";
import { TokenTypeEnum } from "../../Utils/Security/token";
import { RoleEnum } from "../../DB/Models/user.model";
import userService from "./user.service";
import { validation } from "../../Middlewares/validation.middleware";
import { logoutSchema } from "./user.validation";
import {
  cloudFileUpload,
  fileValidation,
  StorageEnum,
} from "../../Utils/Multer/cloud.multer";
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
    accessRoles: [RoleEnum.user, RoleEnum.admin],
  }),
  userService.refreshToken
);

router.patch(
  "/profile-image",
  authentication({
    tokenType: TokenTypeEnum.access,
    accessRoles: [RoleEnum.user],
  }),
  cloudFileUpload({
    validation: [...fileValidation.images],
    storageApproch: StorageEnum.memory,
    maxSizeMB: 10,
  }).single("attachment"),
  userService.profileImage
);

router.patch(
  "/cover-images",
  authentication({
    tokenType: TokenTypeEnum.access,
    accessRoles: [RoleEnum.user],
  }),
  cloudFileUpload({
    validation: [...fileValidation.images],
    storageApproch: StorageEnum.memory,
    maxSizeMB: 10,
  }).array("attachments" , 4),
  userService.coverImages
);

export default router;
