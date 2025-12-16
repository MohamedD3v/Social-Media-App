import { HydratedDocument, model, models, Schema, Types } from "mongoose";

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
  confirmEmailOTP?: string;
  expireOTP?: Date | undefined;
  confirmedAt?: Date;
  password: string;
  resetPasswordOTP?: string;
  phone?: string | undefined;
  address?: string | undefined;
  age?: Number | undefined;
  gender?: GenderEnum | undefined;
  role: RoleEnum;
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
    email: { type: String, required: true, unique: true, trim: true },
    confirmEmailOTP: String,
    confirmedAt: Date,
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
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

userSchema
  .virtual("username")
  .set(function (value: string) {
    const [firstName, lastName] = value.split(" ") || [];
    this.set({ firstName, lastName });
  })
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  });

export const UserModel = models.User || model("User", userSchema);

export type HUserDoc = HydratedDocument<IUser>;
