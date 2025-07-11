"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const bot_1 = require("./bot");
const logger_1 = require("./bot/utils/logger");
async function bootstrap() {
    try {
        console.log("NODE_ENV", process.env.NODE_ENV);
        console.log("TELEGRAM_BOT_TOKEN", process.env.TELEGRAM_BOT_TOKEN);
        console.log("NSCALE_API_KEY", process.env.NSCALE_API_KEY);
        console.log("NSCALE_BASE_URL", process.env.NSCALE_BASE_URL);
        console.log("NSCALE_MODEL", process.env.NSCALE_MODEL);
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
