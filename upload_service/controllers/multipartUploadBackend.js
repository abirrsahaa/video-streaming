import AWS from 'aws-sdk';
import { addVideoDetailsToDB } from '../db/db.js';
import { PublishToKafkaToTranscode } from './kafkaPublisher.js';

// need to make 3 api for each of the processes of multipart upload 


//! 1. initiateMultipartUpload

export const initiateMultipartUpload=async (req,res)=>{
    try {

        console.log("i am inside the initiateMultipartUpload controller");

        // config stuff for aws-sdk
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region:"ap-southeast-2"
        })
        
        const s3=new AWS.S3();

        // !baki sab thik hai par mereko key ke liye file ka name chahiye

        const {filename}=req.body; //basic js same as const filename=req.body['filename']
        console.log("the filename is ",filename);

        const UploadParams={
            Bucket:process.env.AWS_BUCKET,
            Key:filename,
            ACL:"public-read",
            ContentType:'video/mp4'
        }

        console.log("Going for creation of multipartUpload that is the first step");
        const multiPartParams=await s3.createMultipartUpload(UploadParams).promise();
        console.log("the multiPartParams is ",multiPartParams);

        const uploadId=multiPartParams.UploadId;

        return res.status(200).send({uploadId});




        
    } catch (error) {
        console.log("this error is in the initiateMultipartUpload controller ",error);
        return res.status(500).send("Internal Server Error and this is in the initiateMultipartUpload controller");
    }
}

//! 2. uploadPart

export const uploadParts=async (req,res)=>{
    try {

        console.log("i am inside the uploadParts controller");

        // here first do that things that you know ke kya kya chahiye then we will be getting it 

        // !config setup for aws-sdk
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region:"ap-southeast-2"
        })
        
        const s3=new AWS.S3();

        const {filename,chunkIndex,uploadId}=req.body;

        const UploadPartsParms={
                Bucket:process.env.AWS_BUCKET,
                Key:filename,
                PartNumber:parseInt(chunkIndex)+1,
                UploadId:uploadId,
                Body:req.file.buffer,//idhar body toh har ak chunk ka hoyega 
        }

        console.log("Going for the uploadPart process");
        const data = await s3.uploadPart(UploadPartsParms).promise();
        console.log("the data from the uploadPart is ",data);
        // !mereko idhar se etag bhejna hi hai 
        return res.status(200).json({success:true});

        
    } catch (error) {

        console.log("this error is in the uploadParts controller ",error);
        return res.status(500).send("Internal Server Error and this is in the uploadParts controller");
        
    }
}

//! 3. completeMultipartUpload

export const completeMultipartUpload=async (req,res)=>{
    try {

        console.log(" i am inside the completeMultipartUpload controller");

        // basic config setup for aws-sdk
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region:"ap-southeast-2"
        })

        const s3=new AWS.S3();

        // !agar e tag nahi hai hum uss bucket and uss uploadId se bohot kuch kar sakte hhai 
        const {uploadId,filename}=req.body;

        const completeParams={
            Bucket:process.env.AWS_BUCKET,
            Key:filename,     
            UploadId:uploadId
        }


        console.log("here i am listing all the uploaded parts from the bucket with the uploadId");
        const data=await s3.listParts(completeParams).promise();
        console.log("the parts are ",data);

        const parts=data.Parts.map(part=>({
            ETag:part.ETag,
            PartNumber:part.PartNumber
        }));

        completeParams.MultipartUpload={
            Parts:parts
        }

        console.log("Going for the completeMultipartUpload process");
        const completeData=await s3.completeMultipartUpload(completeParams).promise();
        console.log("the completeData is ",completeData);
        const {title,description,author}=req.body; 
        console.log("the things got form the body are ",title,description,author);
        const url=completeData.Location;
        await addVideoDetailsToDB(title,description,author,url);
        // !call kafka for transcoding 
        PublishToKafkaToTranscode(title,completeData.Key);
        
        return res.status(200).json({ message: "Uploaded successfully!!!" });





        
    } catch (error) {
        console.log("this error is in the completeMultipartUpload controller ",error);
        return res.status(500).send("Internal Server Error and this is in the completeMultipartUpload controller");
        
    }
}