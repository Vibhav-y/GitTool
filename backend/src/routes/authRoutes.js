import express from "express";
const router = express.Router();
import { githubAuth, signUp, logIn } from "../controllers/authController.js";

router.post("/github", githubAuth);
router.post("/signup", signUp);
router.post("/login", logIn);

export default router;
