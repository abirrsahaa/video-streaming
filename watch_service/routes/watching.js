import express from "express"
import watchVideo from "../controllers/watchservice.js";


const router = express.Router();

router.get('/', watchVideo);

export default router;