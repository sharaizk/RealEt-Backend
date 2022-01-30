import { config } from "dotenv";
config();
export default {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  environment: process.env.NODE_ENV,
  JWT_EXPIRE_TIME: process.env.JWT_EXPIRE_TIME,
  JWT_SECRET: process.env.JWT_SECRET,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_BUCKET_REGION,
  AWSBucket: process.env.AWS_BUCKET_NAME,
};
