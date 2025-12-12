import { Request, Response } from "express";
import { ISignupDto } from "./auth.dto";
import * as valdators from "./auth.validation";
import { BadRequestException } from "../../Utils/Response/err.response";
class AuthenticationService {
  constructor() {}

  signup = (req: Request, res: Response) => {
    const { username, email, password, phone, gender , confirmPassword }: ISignupDto = req.body;
    console.log({ username, email, password, phone, gender , confirmPassword });
    const result = valdators.signupSchema.body.safeParse({
      username,
      email,
      password,
      phone,
      gender,
      confirmPassword
    });
    if (result.error) {
      throw new BadRequestException("in-valid request ", {
        cause: JSON.parse(result.error as unknown as string),
      });
    }
    return res.status(201).json({ message: "Test Signup Api" , result });
  };
  login = (req: Request, res: Response) => {
    return res.status(200).json({ message: "Test login Api" });
  };
}

export default new AuthenticationService();
