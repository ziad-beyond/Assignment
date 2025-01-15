import { Request, Response } from "express";
import express from "express";
import dotenv from "dotenv";
import prisma from "./config/prisma";
import expenseRoute from "./routes/expenseRoute";
import authRoute from "./routes/authRoute";
import errorHandler from "./middleware/errorHandler";
import { createClient } from "@supabase/supabase-js";

const app = express();
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error("Supabase environment variables are missing.");
}

app.use(express.json());
const cors = require("cors");
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send("Welcome To my expenses tracker");
});

app.use('/', expenseRoute); 
app.use('/', authRoute); 
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log("running on port " + process.env.PORT);
});
