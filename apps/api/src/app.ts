import cors from "cors";
import express from "express";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import tasksRoutes from "./modules/tasks/tasks.routes.js";

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Enable CORS
app.use(cors());

// HTTP request logging
app.use(morgan("dev"));

// Health check endpoint
app.get("/health", (_req, res) => {
	res.status(200).json({ status: "healthy", timestamp: new Date() });
});

// Register routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", tasksRoutes);

// Error handling middleware (must be registered last)
app.use(errorHandler);

export default app;
