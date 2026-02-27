import express from "express";
const router = express.Router();
import { generateReadme, saveReadme, chatReadme } from "../controllers/readmeController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

router.post("/", verifyToken, generateReadme);
router.post("/chat", verifyToken, chatReadme);
router.post("/save", saveReadme);

export default router;
