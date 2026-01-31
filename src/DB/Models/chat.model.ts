import { HydratedDocument, model, models, Schema, Types } from "mongoose";
export interface IMessage {
  content: string;
  createdBy: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}
export interface IChat {
  p2p: Types.ObjectId[];
  msg: IMessage[];
  group?: string;
  groupImage?: string;
  roomId?: string;
  createdBy: Types.ObjectId;

  createdAt: Date;
  updatedAt?: Date;
}

export const messageSchema = new Schema<IMessage>(
  {
    content: { type: String, required: true, maxLength: 1000, minLength: 2 },
    createdBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true },
);
export const chatSchema = new Schema<IChat>(
  {
    p2p: [{ type: Schema.Types.ObjectId, required: true, ref: "User" }],
    createdBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    group: String,
    groupImage: String,
    roomId: {
      type: String,
      required: function () {
        return this.roomId;
      },
    },
    msg: [messageSchema],
  },
  { timestamps: true },
);
export type HChatDoc = HydratedDocument<IChat>;
export type HMessageDoc = HydratedDocument<IMessage>;
export const ChatModel = models.Chat || model<IChat>("Chat", chatSchema);
