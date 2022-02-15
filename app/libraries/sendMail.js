import nodemailer from "nodemailer";
const sendingEmail = "mx0bangmail.com";

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shopit290@gmail.com", // TODO: your gmail account
    pass: "Steyn123", // TODO: your gmail password
  },
});

export const sendConfirmEmail = async (options) => {
  const message = {
    to: options.email,
    from: `RealEt ${sendingEmail}`,
    subject: options.subject,
    text: options.text,
  };

  await transporter.sendMail(message);
};
