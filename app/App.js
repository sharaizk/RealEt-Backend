import express from "express";
import bodyParser from "body-parser";
import path from "path";
import config from "./config";
import database from "./database";
import middlewares from "./middlewares";
import apiRouter from "./routes/routes";

// Initializing Express Application
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Running Middlewares
middlewares(app);

// Running API Routes
app.use("/api", apiRouter);

//
app.use("/", express.static(path.join(__dirname, "../client/build")));
app.get("/*", (req, res) =>
  res.sendFile(path.resolve(__dirname, "../client/build"))
);

// Connecting To Database and Running Express Server
app.listen(config.PORT, () => {
  console.log("✓", `Listening on port ${config.PORT}`);
});
database();
