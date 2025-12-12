import { z } from "zod";

export const signupSchema = {
  body: z
    .strictObject({
      username: z.string().min(6).max(20),
      email: z.email(),
      password: z.string().min(8),
      confirmPassword: z.string(),
      phone: z.string(),
      gender: z.string(),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: "Password Not Matched !!",
        });
       
      };
      if(data.username?.split(" ").length !== 2){
            ctx.addIssue({
                code:"custom",
                path:["username"],
                message:"Username must be 2 Words , example:'Mohamed Abdellatef'"
            })
        }
    }),
};
