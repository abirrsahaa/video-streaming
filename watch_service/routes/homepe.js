import exoress from 'express';
import { Router } from 'express';
import getAllVideos from '../controllers/home.js';


const router=Router();

router.get("/",getAllVideos);

export default router;