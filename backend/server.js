import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./src/routes/index.js";
import errorHandler from "./src/middleware/errorMiddleware.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", apiRoutes);

// Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
