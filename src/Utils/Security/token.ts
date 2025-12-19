import { verify, sign, Secret, JwtPayload, SignOptions } from "jsonwebtoken";
import { HUserDoc, RoleEnum } from "../../DB/Models/user.model";
import { v4 as uuid } from "uuid";
export enum SignatureLevelEnum {
  admin = "admin",
  user = "user",
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
