import { Model } from "mongoose";
import { DatabaseRepository } from "./database.repository";
import { IPost } from "../Models/post.model";
export class PostRepository extends DatabaseRepository<IPost> {
  constructor(protected override readonly model: Model<IPost>) {
    super(model);
  }
}
