import { bot } from "./bot";
import { logger } from "./bot/utils/logger";

async function bootstrap() {
	try {
		logger.info("Bot is running...");
		await bot.launch();
	} catch (error) {
		logger.error(`Bot failed to start: ${error}`);
		process.exit(1);
	}
}

bootstrap();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
