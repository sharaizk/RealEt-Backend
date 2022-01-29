import express from "express";
import config from "./config";

const app = express();

export default () => {
  app.listen(config.PORT, (err) => {
    return (
      (err && console.log(err)) ||
      console.log(`Server Running on ${config.PORT}`)
    );
  });
};
