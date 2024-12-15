import { Router } from "express";
import sendMessageToKafka from "../controllers/kafkaPublisher.js";


const router=Router();

router.post("/",sendMessageToKafka);
export default router;