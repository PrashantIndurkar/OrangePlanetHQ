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

const allowedOrigins = process.env.ALLOWED_ORIGINS
	? process.env.ALLOWED_ORIGINS.split(",")
	: ["http://localhost:3000"];

if (process.env.FRONTEND_URL && !allowedOrigins.includes(process.env.FRONTEND_URL)) {
	allowedOrigins.push(process.env.FRONTEND_URL);
}

// Enable CORS with support for credentials (cookies for EventSource)
app.use(
	cors({
		origin: (origin, callback) => {
			// Allow requests with no origin (like curl or postman)
			if (!origin) {
				return callback(null, true);
			}

			if (allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
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
