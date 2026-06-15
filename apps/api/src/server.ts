import app from "./app.js";
import { env } from "./config/env.js";
import { startKeepAlive } from "./utils/keep-alive.js";

const server = app.listen(env.PORT, () => {
	console.log(
		`🚀 API Server running on port ${env.PORT} in ${env.NODE_ENV} mode`,
	);

	// Start the self-pinging keep-alive mechanism to prevent Render sleep
	startKeepAlive();
});

const exitHandler = () => {
	if (server) {
		server.close(() => {
			console.log("Server closed");
			process.exit(0);
		});
	} else {
		process.exit(0);
	}
};

const unexpectedErrorHandler = (error: unknown) => {
	console.error(error);
	exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
	console.log("SIGTERM received");
	if (server) {
		server.close();
	}
});
