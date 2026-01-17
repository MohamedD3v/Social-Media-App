import {
  HydratedDocument,
  model,
  models,
  Schema,
  Types,
  UpdateQuery,
} from "mongoose";
import { TokenRepository } from "../Repository/token.repository";
import { TokenModel } from "./token.model";
import { generateHash } from "../../Utils/Security/hash";
import { emailEvent } from "../../Utils/Events/email.events";

export enum GenderEnum {
  male = "male",
  female = "female",
}

export enum RoleEnum {
  admin = "admin",
  user = "user",
}

export interface IUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  slug: string;
  confirmEmailOTP?: string;
  expireOTP?: Date | undefined;
  confirmedAt?: Date;
  changeCredientialsTime: Date;
  password: string;
  resetPasswordOTP?: string;
  phone?: string | undefined;
  address?: string | undefined;
  age?: Number | undefined;
  gender?: GenderEnum;
  role: RoleEnum;
  profileImage: string;
  coverImages: string[];
  createdAt: Date;
  updatedAt?: Date;
}
export const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 41,
    },
    email: { type: String, required: true, unique: true, trim: true },
    confirmEmailOTP: String,
    confirmedAt: Date,
    changeCredientialsTime: Date,
    password: { type: String, required: true, minlength: 8, trim: true },
    resetPasswordOTP: String,
    phone: String,
    address: String,
    age: Number,
    gender: {
      type: String,
      enum: Object.values(GenderEnum),
      default: GenderEnum.male,
    },
    role: {
      type: String,
      enum: Object.values(RoleEnum),
      default: RoleEnum.user,
    },
    expireOTP: Date,
    profileImage: String,
    coverImages: String,
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

userSchema
  .virtual("username")
  .set(function (value: string) {
    const [firstName, lastName] = value.split(" ") || [];
    this.set({ firstName, lastName, slug: value.replaceAll(/\s+/g, "_") });
  })
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  });

userSchema.pre(
  "save",
  async function (
    this: HUserDoc & { wasNew: boolean; confirmEmailPlainOTP?: string }
  ) {
    this.wasNew = this.isNew;
    if (this.isModified("password")) {
      this.password = await generateHash(this.password);
    }
    if (this.isModified("confirmEmailOTP")) {
      this.confirmEmailPlainOTP = this.confirmEmailOTP as string;
      this.confirmEmailOTP = await generateHash(this.confirmEmailOTP as string);
    }
  }
);
userSchema.post("save", async function () {
  const that = this as unknown as HUserDoc & {
    wasNew: boolean;
    confirmEmailPlainOTP?: string;
  };
  if (that.wasNew && that.confirmEmailPlainOTP) {
    await emailEvent.emit("confirmEmail", {
      to: this.email,
      username: this.username,
      otp: that.confirmEmailPlainOTP,
    });
  }
});
userSchema.pre("updateOne", async function () {
  const update = this.getUpdate() as UpdateQuery<HUserDoc>;
  if (update.freezedAt) {
    this.setUpdate({ ...update, changeCredientialsTime: new Date() });
  }
});
userSchema.pre("updateOne", async function () {
  const query = this.getQuery();
  const update = this.getUpdate() as UpdateQuery<HUserDoc>;
  if (update["$set"].changeCredientialsTime) {
    const tokenModel = new TokenRepository(TokenModel);
    await tokenModel.deleteMany({ filter: { userId: query._id } });
  }
});
userSchema.pre("findOneAndDelete", async function () {
  const query = this.getQuery();
  const tokenModel = new TokenRepository(TokenModel);
  await tokenModel.deleteMany({ filter: { userId: query._id } });
});
userSchema.pre("insertMany", async function (docs) {
  for (const doc of docs) {
    doc.password = await generateHash(doc.password);
  }
});

export const UserModel = models.User || model<IUser>("User", userSchema);

export type HUserDoc = HydratedDocument<IUser>;
