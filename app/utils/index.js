import { sendConfirmEmail } from "../libraries/sendMail";
import sendVerificationCode from "../libraries/sendMessage";

export const randomOTP = () => Math.floor(1000 + Math.random() * 900);

export const sendOTP = async (loginType, login, OTP, message) => {
  switch (loginType) {
    case "email":
      await sendConfirmEmail({
        email: login,
        subject: message.subject,
        text: message.text,
      });
      break;
    case "phoneNumber":
      await sendVerificationCode(login, OTP);
      break;
    default:
      break;
  }
};
