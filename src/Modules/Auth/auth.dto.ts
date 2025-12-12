import {z} from "zod";
import { signupSchema } from "./auth.validation";

export type ISignupDto = z.infer<typeof signupSchema.body>