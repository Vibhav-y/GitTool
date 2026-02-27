import express from "express";
const router = express.Router();
import { getBalance, getTransactions } from "../controllers/tokenController.js";
import { createOrder, verifyPayment, getPackages } from "../controllers/paymentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

// Token routes
router.get("/balance", verifyToken, getBalance);
router.get("/transactions", verifyToken, getTransactions);

// Payment routes
router.get("/packages", getPackages);
router.post("/order", verifyToken, createOrder);
router.post("/verify", verifyToken, verifyPayment);

export default router;
