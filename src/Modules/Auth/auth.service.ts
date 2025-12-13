import { Request, Response } from "express";
import { ILoginDto, ISignupDto } from "./auth.dto";
class AuthenticationService {
  constructor() {}

  signup = (req: Request, res: Response) => {
    const {
    username,
      email,
      password,
      phone,
      gender,
      confirmPassword,
    }: ISignupDto = req.body;
    console.log({ username, email, password, phone, gender, confirmPassword });

    return res.status(201).json({ message: "Test Signup Api"});
  };
  login = (req: Request, res: Response) => {
    const { email, password }: ILoginDto = req.body;
    console.log({ email, password });

    return res.status(200).json({ message: "Test login Api" });
  };
}

export default new AuthenticationService();
