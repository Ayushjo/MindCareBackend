import { Router } from "express";
import { getAllChats } from "../controllers/journalController.js";

const router = Router();

router.route("/getAllJournals").post(getAllChats)


export default router