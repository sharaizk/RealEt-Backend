import express from "express";
import config from "./config";
import database from "./database";
import middlewares from "./middlewares";
import apiRouter from "./routes/routes";

// Initializing Express Application
const app = express();

// Running Middlewares
middlewares(app);

// Running API Routes
app.use("/api", apiRouter);

// Connecting To Database and Running Express Server
app.listen(config.PORT, (err) => {
  if (err) console.log(`${err.message}`, err);
  console.log("✓", `Listening on port ${config.PORT}`);
});
database();
