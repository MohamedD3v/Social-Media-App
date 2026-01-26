import { HydratedDocument, model, models, Schema, Types } from "mongoose";

export interface IComment {
  content: string;
  attachments?: string[];
  tags?: Types.ObjectId[];
  likes?: Types.ObjectId[];
  createdBy: Types.ObjectId;
  postId: Types.ObjectId;
  commentId?: Types.ObjectId;
  freezedAt?: Date;
  freezedBy?: Types.ObjectId;
  restoredBy?: Types.ObjectId;
  restoredAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      minLength: 2,
      maxLength: 8000,
      required: function (): boolean {
        return !this.attachments?.length;
      },
    },
    attachments: [String],
    tags: [{ type: Schema.Types.ObjectId, ref: "User" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    commentId: { type: Schema.Types.ObjectId, ref: "Comment" },
    freezedAt: Date,
    freezedBy: { type: Schema.Types.ObjectId, ref: "User" },
    restoredBy: { type: Schema.Types.ObjectId, ref: "User" },
    restoredAt: Date,
  },
  { timestamps: true },
);
export type HCommentDoc = HydratedDocument<IComment>;
export const CommentModel = models.Comment || model<IComment>("Comment", commentSchema);
