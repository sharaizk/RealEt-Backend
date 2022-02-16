import nodemailer from "nodemailer";
import config from "../config";
const sendingEmail = "mx0bangmail.com";

let transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: "mx0bangmail.com",
    pass: config.PASSWORD,
  },
});

export const sendConfirmEmail = async (options) => {
  const message = {
    to: options.email,
    from: `RealEt ${sendingEmail}`,
    subject: options.subject,
    text: options.text,
  };

  transporter
    .sendMail(message)
    .then((response) => console.log(response))
    .catch((error) => console.log(error.message));
};
