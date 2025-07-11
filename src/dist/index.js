"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = require("./bot");
const logger_1 = require("./bot/utils/logger");
async function bootstrap() {
    try {
        logger_1.logger.info("Bot is running...");
        await bot_1.bot.launch();
    }
    catch (error) {
        logger_1.logger.error(`Bot failed to start: ${error}`);
        process.exit(1);
    }
}
bootstrap();
// ============================
// Handle graceful shutdown
// ============================
process.once("SIGINT", () => {
    logger_1.logger.info("Received SIGINT, stopping bot...");
    bot_1.bot.stop("SIGINT");
});
process.once("SIGTERM", () => {
    logger_1.logger.info("Received SIGTERM, stopping bot...");
    bot_1.bot.stop("SIGTERM");
});
