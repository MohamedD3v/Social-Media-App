import { Request, Response } from "express";
import { IConfirmEmailDto, ILoginDto, ISignupDto } from "./auth.dto";
import { UserModel } from "../../DB/Models/user.model";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "../../Utils/Response/err.response";
import { UserRepository } from "../../DB/Repository/user.repository";
import { compareHash, generateHash } from "../../Utils/Security/hash";
import { generateOTP } from "../../Utils/Security/generateOTP";
import { emailEvent } from "../../Utils/Events/email.events";
import { getLoginCredentails } from "../../Utils/Security/token";
import { TokenModel } from "../../DB/Models/token.model";
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
    const expiresAt = new Date(
      Date.now() + Number(process.env.EXPIRES_IN_OTP) * 1000
    );

    const otp = generateOTP();
    const newUser = await this._userModel.createUser({
      data: [
        {
          username,
          email,
          password: await generateHash(password),
          confirmEmailOTP: await generateHash(otp),
          expireOTP: expiresAt,
          phone,
          gender,
          age,
          address,
        },
      ],
      options: { validateBeforeSave: true },
    });
    await emailEvent.emit("confirmEmail", {
      to: email,
      username,
      otp,
    });
    return res
      .status(201)
      .json({ message: "Account has been Created Successfully", newUser });
  };
  login = async (req: Request, res: Response) => {
    const { email, password }: ILoginDto = req.body;
    const user = await this._userModel.findOne({ filter: { email } });
    if (!user) throw new NotFoundException("User Not Found");
    if (!user.confirmedAt) throw new BadRequestException("Verify Your Account");
    if (!(await compareHash(password, user.password)))
      throw new BadRequestException("in-valid email or password");
    const credentials = await getLoginCredentails(user);
    return res.status(200).json({
      message: `Login Successfully, Welcome Back`,
      credentials,
    });
  };

  confirmEmail = async (req: Request, res: Response): Promise<Response> => {
    const { email, otp }: IConfirmEmailDto = req.body;
    const user = await this._userModel.findOne({
      filter: {
        email,
        confirmEmailOTP: { $exists: true },
        confirmedAt: { $exists: false },
      },
    });
    if (!user) throw new NotFoundException("User not Found");
    if (!(await compareHash(otp, user?.confirmEmailOTP as string)))
      throw new BadRequestException("in-valid OTP ");

    if (user.expireOTP && user.expireOTP < new Date())
      throw new BadRequestException("OTP Expired");
    await this._userModel.updateOne({
      filter: { email },
      update: {
        confirmedAt: new Date(),
        $unset: { confirmEmailOTP: true, expireOTP: true },
      },
    });
    return res
      .status(200)
      .json({ message: "Account has been Confirmed Successfully" });
  };
}

export default new AuthenticationService();
