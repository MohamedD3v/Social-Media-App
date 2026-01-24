import { Request, Response } from "express";
import { UserRepository } from "../../DB/Repository/user.repository";
import { HUserDoc, UserModel } from "../../DB/Models/user.model";
import { PostRepository } from "../../DB/Repository/post.repository";
import {
  AvailablityEnum,
  LikeEnum,
  PostModel,
} from "../../DB/Models/post.model";
import {
  BadRequestException,
  NotFoundException,
} from "../../Utils/Response/err.response";
import { uploadFiles } from "../../Utils/Multer/s3.config";
import { v4 as uuid } from "uuid";
import { IPostDTO } from "./post.dto";
import { UpdateQuery } from "mongoose";
class PostService {
  private _userModel = new UserRepository(UserModel);
  private _postModel = new PostRepository(PostModel);
  constructor() {}
  createPost = async (req: Request, res: Response) => {
    if (
      req.body.tags?.length &&
      (await this._userModel.find({ filter: { _id: req.body.tags } }))
        .length !== req.body.tags.length
    ) {
      throw new NotFoundException(
        "Some User who are you Mentioned to him Are Not Exists",
      );
    }
    let attachments: string[] = [];
    let assetFolder = undefined;
    if (req.files?.length) {
      let assetFolderId: string = uuid();
      attachments = await uploadFiles({
        files: req.files as Express.Multer.File[],
        path: `users/${req.user?._id}/post/${assetFolderId}`,
      });
      assetFolder = assetFolderId;
    }
    const [post] =
      (await this._postModel.create({
        data: [
          {
            ...req.body,
            attachments,
            assetFolderId: assetFolder,
            createdBy: req.user?._id,
          },
        ],
      })) || [];
    if (!post) throw new BadRequestException("fail to create post");
    return res
      .status(201)
      .json({ message: "Post has been Created Successfully", post });
  };
  likePost = async (req: Request, res: Response) => {
    const { postId } = req.params as unknown as { postId: string };
    const { action } = req.query as unknown as { action: string };
    let update: UpdateQuery<HUserDoc> = {
      $addToSet: { likes: req.user?._id },
    };
    if (action === LikeEnum.unlike) {
      update = { $pull: { likes: req.user?._id } };
    }
    const post = await this._postModel.findOneAndUpdate({
      filter: { _id: postId, availablity: AvailablityEnum.public },
      update,
    });
    if (!post) throw new NotFoundException("Post not found");
    return res.status(200).json({ message: "Liked", post });
  };
  getPosts = async (req: Request, res: Response) => {
    const { size, page } = req.query as unknown as {
      size: number;
      page: number;
    };
    const posts = await this._postModel.paginate({
      filter: {
        availablity: AvailablityEnum.public,
        size,
        page,
      },
    });
    return res.status(200).json({ message: "Posts has been Fetched", posts });
  };
}

export default new PostService();
