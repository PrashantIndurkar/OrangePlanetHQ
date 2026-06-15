import { env } from "../config/env.js";

export function startKeepAlive() {
	const url = env.API_URL || env.RENDER_EXTERNAL_URL;
	if (!url) {
		console.log(
			"⚠️ keepAlive: API_URL or RENDER_EXTERNAL_URL not set, skipping keep-alive ping.",
		);
		return;
	}

	let baseUrlStr = url;
	if (baseUrlStr.endsWith("/api/v1")) {
		baseUrlStr = baseUrlStr.substring(0, baseUrlStr.length - "/api/v1".length);
	} else if (baseUrlStr.endsWith("/api/v1/")) {
		baseUrlStr = baseUrlStr.substring(0, baseUrlStr.length - "/api/v1/".length);
	}

	// Build the health URL target
	const healthUrl = new URL("/health", baseUrlStr).href;
	console.log(
		`🚀 keepAlive: Starting keep-alive ping to ${healthUrl} every 14 minutes.`,
	);

	// Ping immediately on start to verify
	ping(healthUrl);

	// Ping every 14 minutes
	const FOURTEEN_MINUTES = 14 * 60 * 1000;
	setInterval(() => {
		ping(healthUrl);
	}, FOURTEEN_MINUTES);
}

async function ping(url: string) {
	try {
		const res = await fetch(url);
		if (res.ok) {
			console.log(
				`✅ keepAlive: Ping to ${url} succeeded with status ${res.status}`,
			);
		} else {
			console.warn(
				`⚠️ keepAlive: Ping to ${url} returned status ${res.status}`,
			);
		}
	} catch (error) {
		console.error(`❌ keepAlive: Error pinging ${url}:`, error);
	}
}
