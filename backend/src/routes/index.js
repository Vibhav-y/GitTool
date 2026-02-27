import express from "express";
const router = express.Router();

import authRoutes from "./authRoutes.js";
import repoRoutes from "./repoRoutes.js";
import readmeRoutes from "./readmeRoutes.js";
import projectRoutes from "./projectRoutes.js";
import templateRoutes from "./templateRoutes.js";
import githubRoutes from "./githubRoutes.js";
import aiRoutes from "./aiRoutes.js";

router.use("/auth", authRoutes);
router.use("/repos", repoRoutes);
router.use("/readme", readmeRoutes);
router.use("/projects", projectRoutes);
router.use("/templates", templateRoutes);
router.use("/github", githubRoutes);
router.use("/ai", aiRoutes);

export default router;
