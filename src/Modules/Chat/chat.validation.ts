import z from "zod";
import { generalFields } from "../../Middlewares/validation.middleware";
export const getChatSchema = {
  params: z.strictObject({
    userId: generalFields.id,
  }),
};
