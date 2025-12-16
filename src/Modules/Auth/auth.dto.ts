import { z } from "zod";
import { confirmEmailSchema, loginSchema, signupSchema } from "./auth.validation";

export type ISignupDto = z.infer<typeof signupSchema.body>;

export type ILoginDto = z.infer<typeof loginSchema.body>;

export type IConfirmEmailDto = z.infer<typeof confirmEmailSchema.body>;
