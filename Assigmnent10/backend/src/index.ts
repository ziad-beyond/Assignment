import { Request, Response } from "express"
import express from "express"
import dotenv from "dotenv"
import prisma from "./config/prisma"
import expenseRoute from "./routes/expenseRoute"
import authRoute from"./routes/authRoute"
import errorHandler from "./middleware/errorHandler"
const app = express()
dotenv.config()
app.use(express.json());
const cors = require("cors");
app.use(cors());

app.get('/',(req: Request, res: Response)=>{
    res.send("Welcome to my expenses tracker")
})


app.use('/', expenseRoute); 
app.use('/', authRoute); 

app.use(errorHandler)

app.listen(process.env.PORT, ()=>{
    console.log("running on port "+ process.env.PORT)
})