
import AWS from "aws-sdk"


const uploadingToS3=async (req,res)=>{

    // !explore multer to know the differences between file and files
    // !and different options to upload 

    // !files isiliye hai kyu ki mai ak se zyada files bhej rha hu 

    // console.log("the req received here in file upload to s3 is ",req);
    console.log("checking if file is there ",req.files);
    console.log("checking if file chunk is there ",req.files['chunk']);
    console.log("checking if file totalChunks is there ",req.body['totalChunks']);
    console.log("checking if file chunkIndex is there ",req.body['chunkIndex']);

    // !explore req body and files 

        if (!req.files || !req.files['chunk']||!req.body['totalChunks']||!req.body['chunkIndex']) {
            console.log('Missing required data ');
            return res.status(400).send('Missing required data');
        }
        // !this is when i was using file upload without chunking 
        // const file=req.file;

        // const files=req.files;
 

        // !checking in advance if the file exists or not
        // if (!fs.existsSync(filePath)) {
        //     console.log('File does not exist: ', filePath);
        //     return;
        // }

        const chunk=req.files['chunk'];
        const totalChunks=parseInt(req.body['totalChunks']);
        const chunkIndex=parseInt(req.body['chunkIndex']);
        const filename=req.body['filename'];
        console.log("the filename is ",filename);
        console.log("the chunk is ",chunk[0].buffer);
        console.log("the total chunks is ",totalChunks);
        console.log("the chunk index is ",chunkIndex);





        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region:"ap-southeast-2"
        })

        if(req.body.totalChunks && req.body.chunkIndex !== undefined){

        const params={
            Bucket:process.env.AWS_BUCKET,
            Key:`${filename}_${chunkIndex}`,
            Body:chunk[0].buffer,

        }



        const s3 =new AWS.S3();

        // uploading the file to s3 
        s3.upload(params,(error,data)=>{
            if(error){
                console.log("there was error in uploading the file chunk  to the aws bucket ",error);
                return res.status(404).send('File chunk  upload was not successful');
            }else{
                console.log('File chunk  upload was successful . File Location is : ',data.Location);
                res.status(200).send('File chunk  upload was successfull')
            }
        });
    }else{
        console.log('Missing chunk metadata');
        res.status(400).send('Missing chunk metadata');
    }

   
}

export default uploadingToS3;