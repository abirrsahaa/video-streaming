import { Router } from "express";
import multipartUploadToS3 from "../controllers/multipart.js";
import multer from 'multer';
import { completeMultipartUpload, initiateMultipartUpload, uploadParts } from "../controllers/multipartUploadBackend.js";

const upload=multer();


const router=Router();

router.post('/initialize',upload.none(),initiateMultipartUpload);
router.post('/upload',upload.single('chunk'),uploadParts);
router.post('/complete',completeMultipartUpload);

export default router;