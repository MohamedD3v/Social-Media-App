import { z } from "zod";
import { generalFields } from "../../Middlewares/validation.middleware";

export const loginSchema = {
  body: z.strictObject({
    email: generalFields.email,
    password: generalFields.password,
  }),
};

export const signupSchema = {
  body: loginSchema.body
    .extend({
      username: generalFields.username,
      // firstName:generalFields.firstName,
      // lastName:generalFields.lastName,
      confirmPassword: generalFields.confirmPassword,
      phone: generalFields.phone,
      gender: generalFields.gender,
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: "Password Not Matched !!",
        });
      }
      if (data.username?.split(" ").length !== 2) {
        ctx.addIssue({
          code: "custom",
          path: ["username"],
          message: "Username must be 2 Words , example:'Mohamed Abdellatef'",
        });
      }
    }),
};
