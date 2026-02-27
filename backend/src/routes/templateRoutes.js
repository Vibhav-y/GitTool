import express from "express";
const router = express.Router();
import { getTemplates, getTemplateById } from "../controllers/templateController.js";

router.get("/", getTemplates);
router.get("/:id", getTemplateById);

export default router;
