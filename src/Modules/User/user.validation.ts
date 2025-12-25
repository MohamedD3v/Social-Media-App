import z from "zod"
import { LogoutEnum } from "../../Utils/Security/token"

export const logoutSchema = {
    body:z.strictObject({
        flag:z.enum(LogoutEnum).default(LogoutEnum.only)
    })
}