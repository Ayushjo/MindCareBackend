import { Router } from "express";
import { getAllMoods, submitMood } from "../controllers/moodControllers.js";
const router = Router();


router.route("/submitMood").post(submitMood)
router.route("/getAllMoods").post(getAllMoods)

export default router