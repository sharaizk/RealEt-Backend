import express from "express";
import server from "./server";
import middlewares from "./middlewares";
import apiRouter from "./routes/routes";
const app = express();
server();
middlewares();

app.use("/api", apiRouter);
