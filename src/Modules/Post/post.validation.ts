import z from "zod";
import { generalFields } from "../../Middlewares/validation.middleware";
import { fileValidation } from "../../Utils/Multer/cloud.multer";
import {
  AllowCommentsEnum,
  AvailablityEnum,
  LikeEnum,
} from "../../DB/Models/post.model";

export const createPostSchema = {
  body: z
    .strictObject({
      content: z.string().min(6).max(8000).optional(),
      attachments: z
        .array(generalFields.file(fileValidation.images))
        .max(6)
        .optional(),
      allowComments: z.enum(AllowCommentsEnum).default(AllowCommentsEnum.on),
      tags: z.array(generalFields.id).max(10).optional(),
      likes: z.array(generalFields.id).optional(),
      availablity: z.enum(AvailablityEnum).default(AvailablityEnum.public),
    })
    .superRefine((data, ctx) => {
      if (!data.attachments?.length && !data.content) {
        ctx.addIssue({
          code: "custom",
          path: ["content"],
          message: "Please Write Content or Add attachments",
        });
      }
      if (
        data.tags?.length &&
        data.tags.length !== [...new Set(data.tags)].length
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["tags"],
          message: "Duplicate Tags",
        });
      }
    }),
};

export const likePostSchema = {
  params: z.strictObject({
    postId: generalFields.id,
  }),
  query: z.strictObject({
    action: z.enum(LikeEnum).default(LikeEnum.like),
  }),
};
