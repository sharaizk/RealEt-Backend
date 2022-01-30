import { config } from "dotenv";
config();
export default {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  environment: process.env.NODE_ENV,
  JWT_EXPIRE_TIME: process.env.JWT_EXPIRE_TIME,
  JWT_SECRET: process.env.JWT_SECRET,
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region,
  AWSBucket: process.env.AWSBucket,
};
