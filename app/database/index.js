import { connect } from "mongoose";
import config from "../config";

const options =
  (config.environment === "development" && {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }) ||
  (config.environment === "production" && {
    user: "realET",
    pass: "realET",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

export default async function () {
  try {
    await connect(config.MONGO_URI, options);
    console.log("✅ Db Connected");
  } catch (error) {
    console.log(error);
  }
  return;
}
