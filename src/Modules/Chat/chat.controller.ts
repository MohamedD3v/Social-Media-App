import { Router } from "express";
import { authentication } from "../../Middlewares/authentication.middleware";
import { TokenTypeEnum } from "../../Utils/Security/token";
import { RoleEnum } from "../../DB/Models/user.model";
import { validation } from "../../Middlewares/validation.middleware";
import { getChatSchema } from "./chat.validation";
import chatService from "./chat.service";
const router: Router = Router({ mergeParams: true });
router.get(
  "/",
  authentication({
    tokenType: TokenTypeEnum.access,
    accessRoles: [RoleEnum.user, RoleEnum.admin],
  }),
  validation(getChatSchema),
  chatService.getChat,
);

export default router;
