import cors from "cors";
import express from "express";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Enable CORS
app.use(cors());

// HTTP request logging
app.use(morgan("dev"));

// Health check endpoint
app.get("/health", (req, res) => {
	res.status(200).json({ status: "healthy", timestamp: new Date() });
});

// Error handling middleware (must be registered last)
app.use(errorHandler);

export default app;
