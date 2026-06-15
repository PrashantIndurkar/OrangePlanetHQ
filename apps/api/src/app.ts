import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import realtimeRoutes from "./modules/realtime/realtime.routes.js";
import tasksRoutes from "./modules/tasks/tasks.routes.js";
import uploadRoutes from "./modules/upload/upload.routes.js";

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Parse Cookies
app.use(cookieParser());

const allowedOrigins = ["http://localhost:3000"];

// Enable CORS with support for credentials (cookies for EventSource)
app.use(
	cors({
		origin: (origin, callback) => {
			// Allow requests with no origin (like curl)
			if (!origin) {
				return callback(null, true);
			}

			const isAllowed =
				allowedOrigins.includes(origin) ||
				(process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL);

			if (isAllowed) {
				callback(null, true);
			} else {
				callback(null, false);
			}
		},
		credentials: true,
	}),
);

// HTTP request logging
app.use(morgan("dev"));

// Health check endpoint
app.get("/health", (_req, res) => {
	res.status(200).json({ status: "healthy", timestamp: new Date() });
});

// Register routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", tasksRoutes);
app.use("/api/v1/realtime", realtimeRoutes);
app.use("/api/v1/uploads", uploadRoutes);

// Error handling middleware (must be registered last)
app.use(errorHandler);

export default app;
