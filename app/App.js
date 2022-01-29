import express from "express";
import database from "./database";
import middlewares from "./middlewares";
import apiRouter from "./routes/routes";
import server from "./server";

// Initializing Express Application
const app = express();

// Running Middlewares
middlewares();

// Running API Routes
app.use("/", (req, res) => res.send("Hello"));
app.use("/api", apiRouter);

// Connecting To Database and Running Express Server
server();
database();
