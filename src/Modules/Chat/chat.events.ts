import { Server } from "socket.io";
import { IAuthSocket } from "../Gateway/gateway.dto";
import { ChatService } from "./chat.service";

export class ChatEvent {
  private _ChatService = new ChatService();
  constructor() {}
  sayHi = (socket: IAuthSocket , io:Server) => {
    return socket.on("sayHi", (msg, cb) => {
      this._ChatService.sayHi({ msg, socket, cb , io });
    });
  };
  sendMessage = (socket: IAuthSocket , io:Server) => {
    return socket.on(
      "sendMessage",
      (data: { content: string; sendTo: string }) => {
        this._ChatService.sendMessage({ ...data, socket , io });
      },
    );
  };
}
