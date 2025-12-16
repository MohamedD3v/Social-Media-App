import { CreateOptions, Model } from "mongoose";
import { IUser } from "../Models/user.model";
import { DatabaseRepository } from "./database.repository";
import { BadRequestException } from "../../Utils/Response/err.response";

export class UserRepository extends DatabaseRepository<IUser> {
  constructor(protected override readonly model: Model<IUser>) {
    super(model);
  }
  async createUser({
    data = [],
    options = {},
  }: {
    data: Partial<IUser>[];
    options?: CreateOptions;
  }) {
    const [user] = (await this.create({ data, options })) || [];
    if (!user) throw new BadRequestException("Fail to Create User");
    return user;
  }
}
