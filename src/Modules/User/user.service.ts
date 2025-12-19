import { Request, Response } from "express";

class UserService {
  constructor() {}
  getProfile = async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).json({
      message: "Profile Fetched",
      data: { user: req.user, decoded: req.decoded },
    });
  };
}

export default new UserService();
