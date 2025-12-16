import { Request, Response } from "express";
import { ILoginDto, ISignupDto } from "./auth.dto";
import { UserModel } from "../../DB/Models/user.model";
import {
  BadRequestException,
  ConflictException,
} from "../../Utils/Response/err.response";
import { UserRepository } from "../../DB/Repository/user.repository";
class AuthenticationService {
  private _userModel = new UserRepository(UserModel);

  constructor() {}

  signup = async (req: Request, res: Response) => {
    const {
      username,
      email,
      password,
      phone,
      gender,
      age,
      address,
    }: ISignupDto = req.body;

    const user = await this._userModel.findOne({ filter: { email } });

    if (user) throw new ConflictException("User Already Exists");

    const newUser =
      (await this._userModel.createUser({
        data: [{ username, email, password, phone, gender, age, address }],
        options: { validateBeforeSave: true },
      }));
    return res
      .status(201)
      .json({ message: "Account has been Created Successfully", newUser });
  };
  login = (req: Request, res: Response) => {
    const { email, password }: ILoginDto = req.body;
    console.log({ email, password });

    return res.status(200).json({ message: "Test login Api" });
  };
}

export default new AuthenticationService();
