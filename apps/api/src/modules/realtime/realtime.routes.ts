import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { realtimeService } from "./realtime.service.js";

const router = Router();

router.get("/events", authMiddleware, (req, res) => {
	const user = req.user;
	if (!user) {
		res.status(401).json({ message: "Please authenticate" });
		return;
	}

	// Set necessary headers for SSE
	res.writeHead(200, {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		Connection: "keep-alive",
		"X-Accel-Buffering": "no",
	});

	// Flush headers (optional but helpful for some proxies)
	res.flushHeaders();

	// Register this client to the service
	const clientId = realtimeService.registerClient(user.id, user.role, res);

	// Handle client disconnection
	req.on("close", () => {
		realtimeService.unregisterClient(clientId);
	});
});

export default router;
