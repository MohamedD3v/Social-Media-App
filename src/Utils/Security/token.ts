import { verify, sign, Secret, JwtPayload, SignOptions } from "jsonwebtoken";
import { HUserDoc, RoleEnum, UserModel } from "../../DB/Models/user.model";
import { v4 as uuid } from "uuid";
import {
  BadRequestException,
  NotFoundException,
  UnAuthorziedException,
} from "../Response/err.response";
import { UserRepository } from "../../DB/Repository/user.repository";
import { TokenRepository } from "../../DB/Repository/token.repository";
import { TokenModel } from "../../DB/Models/token.model";
export enum SignatureLevelEnum {
  admin = "admin",
  user = "user",
}

export enum TokenTypeEnum {
  refresh = "refresh",
  access = "access",
}

export enum LogoutEnum {
  only = "only",
  all = "all",
}

export const generateToken = async ({
  payload,
  secret,
  options,
}: {
  payload: object;
  secret: Secret;
  options: SignOptions;
}): Promise<string> => {
  return await sign(payload, secret, options);
};

export const verifyToken = async ({
  token,
  secret,
}: {
  token: string;
  secret: Secret;
}): Promise<JwtPayload> => {
  return (await verify(token, secret)) as JwtPayload;
};

export const getSignatureLevel = async (role: RoleEnum = RoleEnum.user) => {
  let signatureLevel: SignatureLevelEnum = SignatureLevelEnum.user;

  switch (role) {
    case RoleEnum.admin:
      signatureLevel = SignatureLevelEnum.admin;
      break;
    case RoleEnum.user:
      signatureLevel = SignatureLevelEnum.user;
    default:
      break;
  }
  return signatureLevel;
};

export const getSignatures = async (signatureLevel: SignatureLevelEnum) => {
  let signatures: { access_token: string; refresh_token: string } = {
    access_token: "",
    refresh_token: "",
  };

  switch (signatureLevel) {
    case SignatureLevelEnum.admin:
      signatures.access_token = process.env.ACCESS_ADMIN_TOKEN_SECRET as string;
      signatures.refresh_token = process.env
        .REFRESH_ADMIN_TOKEN_SECRET as string;
      break;
    case SignatureLevelEnum.user:
      signatures.access_token = process.env.ACCESS_USER_TOKEN_SECRET as string;
      signatures.refresh_token = process.env
        .REFRESH_USER_TOKEN_SECRET as string;
    default:
      break;
  }
  return signatures;
};

export const getLoginCredentails = async (
  user: HUserDoc
): Promise<{ access_token: string; refresh_token: string }> => {
  const signatureLevel = await getSignatureLevel(user.role);
  const signatures = await getSignatures(signatureLevel);
  const jwtid = uuid();
  const access_token = await generateToken({
    payload: { _id: user._id },
    secret: signatures.access_token,
    options: { expiresIn: Number(process.env.ACCESS_EXPIRES_IN), jwtid },
  });
  const refresh_token = await generateToken({
    payload: { _id: user._id },
    secret: signatures.refresh_token,
    options: { expiresIn: Number(process.env.REFRESH_EXPIRES_IN), jwtid },
  });
  return { access_token, refresh_token };
};

export const decodedToken = async ({
  authorization,
  tokenType = TokenTypeEnum.access,
}: {
  authorization: string;
  tokenType?: TokenTypeEnum;
}) => {
  const userModel = new UserRepository(UserModel);
  const tokenModel = new TokenRepository(TokenModel);

  const [bearer, token] = authorization?.split(" ");
  if (!bearer || !token) throw new UnAuthorziedException("In-valid Token !!");
  const signatures = await getSignatures(bearer as SignatureLevelEnum);
  const decoded = await verifyToken({
    token,
    secret:
      tokenType === TokenTypeEnum.access
        ? signatures.access_token
        : signatures.refresh_token,
  });
  if (!decoded?._id || !decoded.iat)
    throw new UnAuthorziedException("In-valid Token !!");
  if (await tokenModel.findOne({ filter: { jti: decoded.jti as string } }))
    throw new NotFoundException("Token Not Avaiable or Revoked");
  const user = await userModel.findOne({ filter: { _id: decoded._id } });
  if (!user) throw new NotFoundException("User Not Found");
  if ((user.changeCredientialsTime?.getTime() || 0) > decoded.iat * 1000)
    throw new UnAuthorziedException("Logged Out From All Devices");
  return { user, decoded };
};

export const revokeToken = async (decoded: JwtPayload) => {
  const tokenModel = new TokenRepository(TokenModel);
  const [results] =
    (await tokenModel.create({
      data: [
        {
          jti: decoded.jti as string,
          expiresIn: decoded.exp as number,
          userId: decoded._id,
        },
      ],
    })) || [];
  if (!results) throw new BadRequestException("Fail to revoke token");
  return results;
};
