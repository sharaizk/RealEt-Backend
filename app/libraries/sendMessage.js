import twilio from "twilio";
import config from "../config/index.js";

const sendVerificationCode = async (to, code) => {
  const accountSid = config.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com
  const authToken = config.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com
  const twilioNumber = config.TWILIO_NUMBER; // Your Auth Token from www.twilio.com

  const client = new twilio(accountSid, authToken);
  await client.messages.create({
    body: `Your RealEt Password Reset OTP is : ${code}`,
    to, // Text this number
    from: twilioNumber, // From a valid BUY Twilio number
  });
};

export default sendVerificationCode;
