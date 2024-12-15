import { addVideoDetailsToDB } from "../db/db.js";


const uploadDb=async(req,res)=>{
    try {

        const body=req.body;
        await addVideoDetailsToDB(body.title,body.description,body.author,body.url);
        return res.status(200).send("video details added to db successfully");
        
    } catch (error) {

        console.log("this error is in the uploadDb controller ",error);
        return res.status(500).send("this error is in the uploadDb controllerr")
        
    }
}

export default uploadDb;