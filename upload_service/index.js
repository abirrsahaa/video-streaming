import express from "express";
import dotenv from 'dotenv';
import cors from "cors";

import uploadRouter from "./routes/uploadRouter.js"
import multipartUploadRouter from "./routes/multipartUpload.js"
import publishRouter from "./routes/publishing.js"

import uploadDbRouter from "./routes/uploadingDb.js";
dotenv.config();

const app=express();
app.use(express.json());
app.use(cors({
    allowedHeaders: ["*"],
    origin: "*"
 }));

 app.use('/upload',uploadRouter);
 app.use('/multipartUpload',multipartUploadRouter);
 app.use("/publish",publishRouter);
 app.use("/uploadDb",uploadDbRouter);

//  const kafkaConfig=new KafkaConfig();
//  kafkaConfig.consume("transcode",(message)=>{
//     console.log("the message that i got from kafka from transcode is ",message);
//  })
 

app.get("/",(req,res)=>{
    return res.send("hey this is abir ka naya obsessin");
})

const port=process.env.PORT || 5000;


app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})
