"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const http_1 = require("http");
const logger_1 = require("./bot/utils/logger");
const bot_1 = require("./bot");
async function bootstrap() {
    // Create a minimal HTTP server for Render
    const server = (0, http_1.createServer)((req, res) => {
        if (req.url === "/health" && req.method === "GET") {
            logger_1.logger.info("Health check requested");
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: "ok", message: "EngliFix bot is running" }));
        }
        else {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Not Found");
        }
    });
    // Start the HTTP server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        logger_1.logger.info(`HTTP server running on port ${PORT}`);
    });
    // Periodic health check for bot
    setInterval(() => {
        logger_1.logger.info("Bot health check: Running");
    }, 300000); // Log every 5 minutes
    try {
        logger_1.logger.info("Bot is starting...");
        await bot_1.bot.launch();
        logger_1.logger.info("Bot is running successfully");
    }
    catch (error) {
        logger_1.logger.error(`Bot failed to start: ${error}`);
        process.exit(1);
    }
    // Handle graceful shutdown
    process.once("SIGINT", () => {
        logger_1.logger.info("Received SIGINT, stopping bot and server...");
        bot_1.bot.stop("SIGINT");
        server.close(() => process.exit(0));
    });
    process.once("SIGTERM", () => {
        logger_1.logger.info("Received SIGTERM, stopping bot and server...");
        bot_1.bot.stop("SIGTERM");
        server.close(() => process.exit(0));
    });
}
bootstrap();
