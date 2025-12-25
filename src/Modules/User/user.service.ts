import { Request, Response } from "express";
import { LogoutDTO } from "./user.dto";
import {
  getLoginCredentails,
  LogoutEnum,
  revokeToken,
} from "../../Utils/Security/token";
import { JwtPayload } from "jsonwebtoken";
import { UpdateQuery } from "mongoose";
import { IUser, UserModel } from "../../DB/Models/user.model";
import { UserRepository } from "../../DB/Repository/user.repository";

class UserService {
  private _userModel = new UserRepository(UserModel);
  constructor() {}
  getProfile = async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).json({
      message: "Profile Fetched",
      data: { user: req.user, decoded: req.decoded },
    });
  };

  logout = async (req: Request, res: Response): Promise<Response> => {
    const { flag }: LogoutDTO = req.body;
    let statusCode: number = 200;
    const update: UpdateQuery<IUser> = {};
    switch (flag) {
      case LogoutEnum.only:
        await revokeToken(req.decoded as JwtPayload);
        statusCode = 201;
        break;
      case LogoutEnum.all:
        update.changeCredientialsTime = new Date();
        break;
      default:
        break;
    }
    await this._userModel.updateOne({
      filter: { _id: req.decoded?._id },
      update,
    });
    return res.status(statusCode).json({ message: "Logged out Successfully" });
  };
  refreshToken = async (req: Request, res: Response): Promise<Response> => {
    if (!req.user || !req.decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await revokeToken(req.decoded as JwtPayload);
    const credentials = await getLoginCredentails(req.user);
    return res.status(200).json({
      message: "Token has been Refreshed",
      ...credentials,
    });
  };
}

export default new UserService();
