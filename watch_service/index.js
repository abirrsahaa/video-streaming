import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import watchrouter from "./routes/watching.js"
import homee from "./routes/homepe.js"

dotenv.config();

const app=express();

app.use(cors({
    allowedHeaders: ["*"],
    origin: "*"
 }));

const port=process.env.PORT || 8085;

app.use("/watch",watchrouter);
app.use("/home",homee);

app.get("/",(req,res)=>{
    return res.send("welcome to abir ka watch service ");
})

app.listen(port,()=>{
    console.log(`watch service Server is running at ${port}`);
})
