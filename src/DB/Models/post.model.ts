import { HydratedDocument, model, models, Schema, Types } from "mongoose";

export enum AllowCommentsEnum {
  on = "on",
  off = "off",
}
export enum LikeEnum {
  unlike = "unlike",
  like = "like",
}
export enum AvailablityEnum {
  public = "public",
  onlyme = "onlyme",
  friends = "friends",
}
export interface IPost {
  content: string;
  attachments?: string[];
  allowComments?: AllowCommentsEnum;
  tags?: Types.ObjectId[];
  likes?: Types.ObjectId[];
  availablity?: AvailablityEnum;
  assetPostFolderId: string;
  createdBy: Types.ObjectId;
  freezedAt?: Date;
  freezedBy?: Types.ObjectId;
  restoredBy?: Types.ObjectId;
  restoredAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export const postSchema = new Schema<IPost>(
  {
    content: {
      type: String,
      minLength: 6,
      maxLength: 8000,
      required: function (): boolean {
        return !this.attachments?.length;
      },
    },
    attachments: [String],
    allowComments: {
      type: String,
      enum: Object.values(AllowCommentsEnum),
      default: AllowCommentsEnum.on,
    },
    tags: [{ type: Schema.Types.ObjectId, ref: "User" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    availablity: {
      type: String,
      enum: Object.values(AvailablityEnum),
      default: AvailablityEnum.public,
    },
    assetPostFolderId: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    freezedAt: Date,
    freezedBy: { type: Schema.Types.ObjectId, ref: "User" },
    restoredBy: { type: Schema.Types.ObjectId, ref: "User" },
    restoredAt: Date,
  },
  { timestamps: true },
);
export type HPostDoc = HydratedDocument<IPost>;
export const PostModel = models.Post || model<IPost>("Post", postSchema);
