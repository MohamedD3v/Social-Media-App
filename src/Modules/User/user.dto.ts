import z from "zod"
import { logoutSchema } from "./user.validation"

export type LogoutDTO = z.infer<typeof logoutSchema.body>