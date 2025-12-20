import { HydratedDocument, model, models, Schema, Types } from "mongoose";

export interface IToken {
  userId: Types.ObjectId;
  token: string;
  isRevoked: boolean;
  expiresAt: Date;
  jwtid: string;
}

export const tokenSchema = new Schema<IToken>(
  {
    userId: { type: Types.ObjectId, ref: "User" },
    token: String,
    isRevoked: Boolean,
    expiresAt: Date,
    jwtid: String,
  },
  { timestamps: true }
);

tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const TokenModel = models.Token || model("Token", tokenSchema);

export type HTokenDocument = HydratedDocument<IToken>;
