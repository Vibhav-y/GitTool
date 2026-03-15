import express from "express";
import { verifyToken } from "../shared/authMiddleware.js";
import { listStaleBranches, pruneBranches } from "./branchPrunerController.js";
import { listBranches } from "../repo/repoController.js";

const router = express.Router();
router.get("/test", (req, res) => res.json({ branches_prefix: "reachable" }));
router.get("/:owner/:repo", verifyToken, listBranches);
router.get("/:owner/:repo/stale", verifyToken, listStaleBranches);
router.post("/:owner/:repo/prune", verifyToken, pruneBranches);

export default router;
