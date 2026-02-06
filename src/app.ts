import "dotenv/config";
import express from "express";
import type { Application, Request, Response } from "express";

const app: Application = express();
const PORT = 3000;

import * as dotenv from "dotenv"
dotenv.config()

import './database/connection'

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
}); 

app.get("/about", (req: Request, res: Response) => {
  res.send("About Page");
});
app.get("/contact", (req: Request, res: Response) => {
  res.send("Contact Page");
});

app.listen(PORT, () => {
  console.log("Server has started at port", PORT);
});
