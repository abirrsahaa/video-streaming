import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const multipartUploadToS3=async (req,res)=>{
    console.log("here i am in the backend of multipart upload to s3");
    try {
        // !here what i have to do is the thing is 
        // !i will be chunking a file and then be uploading to the s3 from the backend it self 
        // !using the multipart upload function provided by aws sdk

        // !here first trying with a fixed file 

        // !this line converts the current file url to the file path
        const __filename=fileURLToPath(import.meta.url);
        // !this line uses the path module to get the directory from the file path attained from the above step
        const __dirname=path.dirname(__filename);

        console.log("the directory path is ",__dirname);


        const assetsPath=path.resolve(__dirname,'../assets');
        const filepath=path.join(assetsPath,'Lecture 15-16.pdf');

        console.log("the actual file path that would be accessed by is -> ",filepath);

        if(!fs.existsSync(filepath)){
            console.log("the file does not exist ");
            return res.status(400).send("the file does not exist");
        }

        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region:"ap-southeast-2"
        })

        const s3=new AWS.S3();

        // !here i am in the upload initiation part
        const UploadParams={
            Bucket:process.env.AWS_BUCKET,
            Key:"BSS-AESE-HI",
            ACL:"public-read",
            ContentType:'video/mp4'
        }

        console.log("creating Multipart Upload");
        // !this is a request object in aws which by nature is asynchronous so we are explicitly making it a promise in js for making it asynchronous 
        const multiPartParams=await s3.createMultipartUpload(UploadParams).promise();

        const fileSize=fs.statSync(filepath).size;
        
        const chunkSize = 5 * 1024 * 1024; // 5 MB
        const numParts = Math.ceil(fileSize / chunkSize);

        // !this is for the second part of the multipart upload process which is needed there 
        const uploadedETags = []; // Store ETags for uploaded parts

        for(let i=0;i<numParts;i++){
            const start=i*chunkSize;
            const end=Math.min(fileSize,start+chunkSize);

            const ParamsUploadParts={
                Bucket:UploadParams.Bucket,
                Key:UploadParams.Key,
                PartNumber:i+1,
                UploadId:multiPartParams.UploadId,
                Body:fs.createReadStream(filepath,{start,end}),
                ContentLength:end-start
            }

            // !now going for the second step of the multipart upload process
            const data= await s3.uploadPart(ParamsUploadParts).promise();
            console.log(`Uploaded part ${i + 1}: ${data.ETag}`);

            uploadedETags.push({PartNumber:i+1, ETag:data.ETag});


        }


        // !now heading towards the last process of multipart upload 
        const completeParams={
            Bucket:UploadParams.Bucket,
            Key:UploadParams.Key,
            UploadId:multiPartParams.UploadId,
            MultipartUpload:{Parts:uploadedETags}

        }

        console.log('Completing MultiPart Upload');
        const completeRes = await s3.completeMultipartUpload(completeParams).promise();
        console.log(completeRes);


        console.log('File uploaded successfully');
        res.status(200).send('File uploaded successfully');
 
        

        
    } catch (error) {

        console.log("this error is in the multipart upload to s3 controller ",error);

        return res.status(500).send("Internal Server Error and this is in the multipart upload to s3 controller");
        
    }
}


export default multipartUploadToS3;