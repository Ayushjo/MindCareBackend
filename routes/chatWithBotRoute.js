import { Router } from "express";
import { chatWithBot } from "../controllers/chatWithBotController.js";
const router = Router();

router.route("/chatWithBot").post(chatWithBot);

export default router;