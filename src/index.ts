import { env } from "process";
import { bot } from "./bot";
import { logger } from "./bot/utils/logger";

async function bootstrap() {
	try {
		logger.info("TELEGRAM_BOT_TOKEN", env.TELEGRAM_BOT_TOKEN);
		logger.info("NSCALE_API_KEY", env.NSCALE_API_KEY);
		logger.info("NSCALE_BASE_URL", env.NSCALE_BASE_URL);
		logger.info("Bot is running...");
		await bot.launch();
	} catch (error) {
		logger.error(`Bot failed to start: ${error}`);
		process.exit(1);
	}
}

bootstrap();

// ============================
// Handle graceful shutdown
// ============================

process.once("SIGINT", () => {
	logger.info("Received SIGINT, stopping bot...");
	bot.stop("SIGINT");
});
process.once("SIGTERM", () => {
	logger.info("Received SIGTERM, stopping bot...");
	bot.stop("SIGTERM");
});
