import { Router } from "express";
import uploadDb from "../controllers/uploadDb.js";


const router=Router();

router.post("/",uploadDb);
export default router;