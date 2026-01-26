import z from "zod";
import { createCommentSchema } from "./comment.validation";
export type ICommentDTO = z.infer<typeof createCommentSchema>;
