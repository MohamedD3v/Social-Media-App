import { Request, Response } from "express";
import { BadRequestException, ConflictException } from "../../Utils/Response/err.response";

class AuthenticationService {
  constructor() {}

  signup = (req: Request, res: Response) => {
    throw new ConflictException("Error in Signup")
    return res.status(201).json({ message: "Test Signup Api" });
  };
  login = (req: Request, res: Response) => {
    throw new BadRequestException("Error in Login")
    return res.status(200).json({ message: "Test login Api" });
  };
}

export default new AuthenticationService();
