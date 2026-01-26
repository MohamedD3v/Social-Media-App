import z from "zod";
import { generalFields } from "../../Middlewares/validation.middleware";
import { fileValidation } from "../../Utils/Multer/cloud.multer";

export const createCommentSchema = {
  params: z.strictObject({
    postId: generalFields.id,
  }),
  body: z
    .strictObject({
      content: z.string().min(2).max(8000).optional(),
      attachments: z
        .array(generalFields.file(fileValidation.images))
        .max(2)
        .optional(),
      tags: z.array(generalFields.id).max(5).optional(),
    })
    .superRefine((data, ctx) => {
      if (!data.attachments?.length && !data.content) {
        ctx.addIssue({
          code: "custom",
          path: ["content"],
          message: "Comment must be Provde Attachment or Content",
        });
        if (
          data.tags?.length &&
          data.tags?.length !== [...new Set(data.tags)].length
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["tags"],
            message: "Tags id Must be Unique",
          });
        }
      }
    }),
};
