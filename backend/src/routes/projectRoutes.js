import express from "express";
const router = express.Router();
import { 
  getProjects, 
  createProject, 
  getProjectById, 
  updateProject, 
  deleteProject 
} from "../controllers/projectController.js";

router.get("/", getProjects);
router.post("/", createProject);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
