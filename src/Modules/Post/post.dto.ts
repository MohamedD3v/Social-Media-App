import z from "zod";
import { createPostSchema } from "./post.validation";
export type IPostDTO = z.infer<typeof createPostSchema.body>;
