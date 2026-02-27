import express from "express";
const router = express.Router();
import { getRepoData } from "../controllers/githubController.js";

router.post("/repo-data", getRepoData);

export default router;
