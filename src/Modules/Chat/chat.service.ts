import { Request, Response } from "express";
import { IGetChatDTO, IMsgDTO, ISayHiDTO } from "./chat.dto";
import { ChatRepository } from "../../DB/Repository/chat.repository";
import { ChatModel } from "../../DB/Models/chat.model";
import { UserRepository } from "../../DB/Repository/user.repository";
import { UserModel } from "../../DB/Models/user.model";
import { Types } from "mongoose";
import {
  BadRequestException,
  NotFoundException,
} from "../../Utils/Response/err.response";

export class ChatService {
  private _chatModel = new ChatRepository(ChatModel);
  private _userModel = new UserRepository(UserModel);
  constructor() {}
  getChat = async (req: Request, res: Response) => {
    const { userId } = req.params as IGetChatDTO;
    const chat = await this._chatModel.findOne({
      filter: {
        p2p: {
          $all: [
            req.user?._id as Types.ObjectId,
            Types.ObjectId.createFromHexString(userId),
          ],
        },
        group: { $exists: false },
      },
      options: {
        populate: "p2p",
      },
    });
    if (!chat) throw new NotFoundException("Chat not found");
    return res.status(200).json({ msg: "Chat Fetched", chat });
  };
  sayHi = ({ msg, socket, cb, io }: ISayHiDTO) => {
    console.log(msg);

    cb ? cb("Got it") : undefined;
  };
  sendMessage = async ({ content, socket, sendTo, io }: IMsgDTO) => {
    const createdBy = socket.credentials?.user?._id as Types.ObjectId;
    const user = await this._userModel.findOne({
      filter: {
        _id: Types.ObjectId.createFromHexString(sendTo),
        friends: { $in: [createdBy] },
      },
    });
    if (!user) throw new NotFoundException("user not found");
    const chat = await this._chatModel.findOneAndUpdate({
      filter: {
        p2p: {
          $all: [
            createdBy as Types.ObjectId,
            Types.ObjectId.createFromHexString(sendTo),
          ],
        },
        group: { $exists: false },
      },
      update: {
        $addToSet: {
          msg: {
            content,
            createdBy,
          },
        },
      },
    });
    if (!chat) {
      const [newChat] =
        (await this._chatModel.create({
          data: [
            {
              createdBy,
              msg: [{ content, createdBy }],
              p2p: [createdBy, Types.ObjectId.createFromHexString(sendTo)],
            },
          ],
        })) || [];
      if (!newChat) throw new BadRequestException("Fail to create Chat");
    }
    io.emit("successMessage", { content });
    io.emit("newMessage", { content, from: socket.credentials?.user });
  };
}
export default new ChatService();
