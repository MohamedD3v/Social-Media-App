import { UserRepository } from "../../DB/Repository/user.repository";
import { PostRepository } from "../../DB/Repository/post.repository";
import { CommentRepository } from "../../DB/Repository/comment.repository";
import { UserModel } from "../../DB/Models/user.model";
import {
  AllowCommentsEnum,
  AvailablityEnum,
  PostModel,
} from "../../DB/Models/post.model";
import { CommentModel } from "../../DB/Models/comment.model";
import { Request, Response } from "express";
import {
  BadRequestException,
  NotFoundException,
} from "../../Utils/Response/err.response";
import { v4 as uuid } from "uuid";
import { uploadFiles } from "../../Utils/Multer/s3.config";
class CommentService {
  private _userModel = new UserRepository(UserModel);
  private _postModel = new PostRepository(PostModel);
  private _commentModel = new CommentRepository(CommentModel);
  constructor() {}
  createComment = async (req: Request, res: Response) => {
    const { postId } = req.params as unknown as { postId: string };
    const post = await this._postModel.findOne({
      filter: {
        _id: postId,
        allowComments: AllowCommentsEnum.on,
        $or: [
          { availability: AvailablityEnum.friends },
          {
            availablity: AvailablityEnum.public,
          },
        ],
      },
    });
    if (!post)
      throw new NotFoundException(
        "Post Not Found or You don't have access to this Post",
      );
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
        path: `users/${post.createdBy}/post/${assetFolder}/comment`,
      });
      assetFolder = assetFolderId;
    }
    const [comment] =
      (await this._commentModel.create({
        data: [
          {
            ...req.body,
            attachments,
            postId,
            createdBy: req.user?._id,
          },
        ],
      })) || [];
    if (!comment) throw new BadRequestException("fail to create comment");
    return res
      .status(201)
      .json({ message: "Comment has been Created On Post", comment });
  };
}

export default new CommentService();
