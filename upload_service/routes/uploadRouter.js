import { Router } from "express";
import uploadingToS3 from "../controllers/uploadings3.js";
import multer from "multer";


const router=Router();
// !ak cheex idhr humne multer mai storage define nahi kiya hai 
// !so need to explore that later
const upload=multer();

router.post("/",upload.fields([{ name: 'chunk' }, { name: 'totalChunks' }, { name: 'chunkIndex' }]), uploadingToS3);

export default router;