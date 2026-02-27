import express from "express";
const router = express.Router();
import { getRepositories } from "../controllers/repoController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

router.post("/", verifyToken, getRepositories);

export default router;
