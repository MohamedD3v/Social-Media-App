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
import {
  uploadFile,
  uploadFiles,
  uploadLargeFile,
} from "../../Utils/Multer/s3.config";

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
  profileImage = async (req: Request, res: Response): Promise<Response> => {
    // const Key = await uploadFile({
    //   path: `users/${req.decoded?._id}`,
    //   file: req.file as Express.Multer.File,
    // });

    const Key = await uploadLargeFile({
      path: `users/${req.decoded?._id}`,
      file: req.file as Express.Multer.File,
    });

    await this._userModel.updateOne({
      filter: { _id: req.decoded?._id },
      update: { profileImage: Key },
    });
    return res.status(200).json({
      message: "Image has been Uploaded Successfully",
    });
  };

  coverImages = async (req: Request, res: Response): Promise<Response> => {
    const urls = await uploadFiles({
      files: req.files as Express.Multer.File[],
      path: `users/${req.decoded?._id}/cover`,
    });
    return res.status(200).json({
      message: "Image has been Uploaded Successfully",
      urls,
    });
  };
}

export default new UserService();
