import { IAuthSocket } from "../Gateway/gateway.dto";
import z from "zod";
import { getChatSchema } from "./chat.validation";
import { Server } from "socket.io";
export interface ISayHiDTO {
  msg: string;
  socket: IAuthSocket;
  cb: any;
  io: Server;
}
export interface IMsgDTO {
  content: string;
  socket: IAuthSocket;
  sendTo: string;
  io: Server;
}
export type IGetChatDTO = z.infer<typeof getChatSchema.params>;
