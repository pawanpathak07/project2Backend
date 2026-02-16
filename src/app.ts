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
import adminSeeder from "./adminSeeder";
app.use(express.json()) 

//admin seeder
adminSeeder()

// localhost/3000/hello/register
// localhost/3000/register
app.use("", userRoute)



app.listen(PORT, () => {
  console.log("Server has started at port", PORT);
});
