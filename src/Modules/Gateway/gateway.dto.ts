import { Socket } from "socket.io";
import { HUserDoc } from "../../DB/Models/user.model";
import { JwtPayload } from "jsonwebtoken";

export interface IAuthSocket extends Socket {
  credentials?: {
    user: Partial<HUserDoc>;
    decoded: JwtPayload;
  };
}
