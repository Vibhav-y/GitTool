import express from "express";
const router = express.Router();
import { generate, regenerateSection, generateFromRepo } from "../controllers/aiController.js";

router.post("/generate", generate);
router.post("/regenerate-section", regenerateSection);
router.post("/generate-from-repo", generateFromRepo);

export default router;
