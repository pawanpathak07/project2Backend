import "dotenv/config";
import express from "express";
import type { Application, Request, Response } from "express";

const app: Application = express();
const PORT = 3000;

import * as dotenv from "dotenv"
dotenv.config()

// import "reflect-metadata";

import './database/connection'
import userRoute from './routes/userRoute'
app.use(express.json()) 

app.use("", userRoute)

app.listen(PORT, () => {
  console.log("Server has started at port", PORT);
});
