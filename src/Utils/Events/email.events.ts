import { EventEmitter } from "node:events";
import { template } from "../Email/email.template";
import Mail from "nodemailer/lib/mailer";
import { sendEmail } from "../Email/send.mail";

export const emailEvent = new EventEmitter();

interface IEmail extends Mail.Options {
  otp: number;
  username: string;
}
emailEvent.on("confirmEmail", async (data: IEmail) => {
  try {
    (data.subject = "Confirm Your Account"),
      (data.html = template(data.otp, data.username, data.subject));
    await sendEmail(data);
  } catch (error) {
    console.log("Send Email Failed", error);
  }
});
