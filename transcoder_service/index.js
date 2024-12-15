import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import KafkaConfig from "../upload_service/kafka/kafka.js";
import convertToHLS from "./hls/hls.js";
import s3ToS3 from "./hls/hls.js";

dotenv.config();

const app=express();

app.use(cors({
    allowedHeaders: ["*"],
    origin: "*"
 }));

const port=process.env.PORT || 8086;

app.get("/",(req,res)=>{
    return res.send("welcome to abir ka transcoding ka service ");
})

app.get("/transcode", (req,res)=>{
    // convertToHLS();
    s3ToS3();
    return res.send("transcoding started");
})

const kafkaconfig =  new KafkaConfig();
kafkaconfig.consume("transcode", async (value)=>{
   console.log("got data from kafka : " , value)
   const Value=JSON.parse(value);
   await s3ToS3(Value.key);
})


app.listen(port,()=>{
    console.log(`transcoding service Server is running at ${port}`);
})
