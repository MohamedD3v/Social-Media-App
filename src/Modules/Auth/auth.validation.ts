import { z } from "zod";

export const signupSchema = {
  body: z.strictObject({
    username: z
      .string()
      .min(6)
      .max(20),
    email: z.email(),
    password:z.string().min(8),
    confirmPassword:z.string(),
    phone:z.string(),
    gender:z.string()
  })
// .superRefine((data,ctx)=>{
//     if(data.confirmPassword !== data.password){
//         ctx()
//     }
//   })
};
