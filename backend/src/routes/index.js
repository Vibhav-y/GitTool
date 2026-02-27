import express from "express";
const router = express.Router();

import authRoutes from "./authRoutes.js";
import repoRoutes from "./repoRoutes.js";
import readmeRoutes from "./readmeRoutes.js";
import tokenRoutes from "./tokenRoutes.js";

router.use("/auth", authRoutes);
router.use("/repos", repoRoutes);
router.use("/readme", readmeRoutes);
router.use("/tokens", tokenRoutes);

export default router;
