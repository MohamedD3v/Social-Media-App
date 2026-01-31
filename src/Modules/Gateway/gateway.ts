import { Server as htpServer } from "http";
import { Server } from "socket.io";
import { decodedToken, TokenTypeEnum } from "../../Utils/Security/token";
import { IAuthSocket } from "./gateway.dto";
import { ChatGateway } from "../Chat/chat.gateway";
import { BadRequestException } from "../../Utils/Response/err.response";

let io: Server | undefined = undefined;
export const intialize = (httpServer: htpServer) => {
  io = new Server(httpServer, { cors: { origin: "*" } });
  let connectedSocket = new Map<string, string[]>();
  io.use(async (socket: IAuthSocket, next) => {
    const { user, decoded } = await decodedToken({
      authorization: socket.handshake.auth.authorization,
      tokenType: TokenTypeEnum.access,
    });
    const userTabs = connectedSocket.get(user._id.toString()) || [];
    userTabs.push(socket.id);
    connectedSocket.set(user._id.toString(), userTabs);
    socket.credentials = { user, decoded };
    next();
  });
  function disconnect(socket: IAuthSocket) {
    socket.on("disconnect", () => {
      const userId = socket.credentials?.user._id?.toString() as string;
      let openedTabs =
        connectedSocket.get(userId)?.filter((tab) => {
          return tab !== socket.id;
        }) || [];
      if (openedTabs.length) {
        connectedSocket.set(userId, openedTabs);
      } else {
        connectedSocket.delete(userId);
      }
      console.log(`${connectedSocket.get(userId)}: Disconnected`);
    });
  }
  const chatGateway: ChatGateway = new ChatGateway();
  io.on("connection", (socket: IAuthSocket) => {
    console.log(`User ${socket.id}: Connected`);
    chatGateway.sendMsg(socket, getIo());
    disconnect(socket);
  });
};
export const getIo = (): Server => {
  if (!io) {
    throw new BadRequestException("cann't get socket.id");
  }
  return io;
};
