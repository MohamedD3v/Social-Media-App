import { JwtPayload } from "jsonwebtoken";
import { HUserDoc } from "../../DB/Models/user.model";

declare module "express-serve-static-core" {
  interface Request {
    user?: HUserDoc;
    decoded?: JwtPayload;
  }
}
