import Mail from "nodemailer/lib/mailer";
import { createTransport, Transporter } from "nodemailer";

export const sendEmail = async (data: Mail.Options) => {
  const transporter: Transporter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const info = await transporter.sendMail({
    ...data,
    from: `Social Media Mail Test < ${process.env.EMAIL as string} >`,
  });
  console.log("Message Sent :", info.messageId);
};
