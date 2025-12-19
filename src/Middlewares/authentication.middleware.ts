import { NextFunction, Request, Response } from "express";
import { RoleEnum } from "../DB/Models/user.model";
import { decodedToken, TokenTypeEnum } from "../Utils/Security/token";
import {
  BadRequestException,
  ForbiddenException,
} from "../Utils/Response/err.response";

export const authentication = ({
  tokenType = TokenTypeEnum.access,
  accessRoles,
}: {
  tokenType?: TokenTypeEnum;
  accessRoles: RoleEnum[];
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization)
      throw new BadRequestException("Missing Authorization Header");

    const { decoded, user } = await decodedToken({
      authorization: req.headers.authorization,
      tokenType,
    });
    if (!accessRoles.includes(user.role))
      throw new ForbiddenException("u're not Authorized Access this Route");
    req.user = user;
    req.decoded = decoded;
    return next();
  };
};
