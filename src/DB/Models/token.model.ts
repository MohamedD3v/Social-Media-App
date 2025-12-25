import { HydratedDocument, model, models, Schema, Types } from "mongoose";

export interface IToken {
  userId: Types.ObjectId;
  token: string;
  expiresIn: number;
  jti: string;
}

export const tokenSchema = new Schema<IToken>(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    token: String,
    expiresIn: { type: Number, required: true },
    jti: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);
export const TokenModel = models.Token || model("Token", tokenSchema);

export type HTokenDocument = HydratedDocument<IToken>;
