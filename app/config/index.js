import { config } from "dotenv";
config();
export default {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  environment: process.env.NODE_ENV,
  JWT_EXPIRE_TIME: process.env.JWT_EXPIRE_TIME || "7d",
  JWT_SECRET: process.env.JWT_SECRET,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_BUCKET_REGION,
  AWSBucket: process.env.AWS_BUCKET_NAME,
  TWILIO_NUMBER: process.env.TWILIO_NUMBER,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  PASSWORD: process.env.PASSWORD,
};
