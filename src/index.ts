import "dotenv/config";
import { createServer, Server } from "http";
import { logger } from "./bot/utils/logger";
import { bot } from "./bot";

async function bootstrap() {
	const PORT = process.env.PORT || 3000;

	// Create a minimal HTTP server for Render
	const server: Server = createServer((req, res) => {
		if (req.url === "/health" && req.method === "GET") {
			logger.info("Health check requested");
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ status: "ok", message: "EngliFix bot is running" }));
		} else {
			res.writeHead(404, { "Content-Type": "text/plain" });
			res.end("Not Found");
		}
	});

	// Start the HTTP server
	server.listen(PORT, () => {
		logger.info(`HTTP server running on port ${PORT}`);
	});

	// Periodic health check for bot
	setInterval(() => {
		logger.info("Bot health check: Running");
	}, 300000); // Log every 5 minutes

	try {
		logger.info("Bot is starting...");
		await bot.launch();
		logger.info("Bot is running successfully");
	} catch (error) {
		logger.error(`Bot failed to start: ${error}`);
		process.exit(1);
	}

	// Handle graceful shutdown
	process.once("SIGINT", () => {
		logger.info("Received SIGINT, stopping bot and server...");
		bot.stop("SIGINT");
		server.close(() => process.exit(0));
	});
	process.once("SIGTERM", () => {
		logger.info("Received SIGTERM, stopping bot and server...");
		bot.stop("SIGTERM");
		server.close(() => process.exit(0));
	});
}

bootstrap();
