import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { startCommandHandler } from "./handlers/commands/start.command.handler";
import { messageEventHandler } from "./handlers/events/message.event.handler";
import { logger } from "./utils/logger";

// ============================
// Environment Variables
// ============================

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TOKEN || TOKEN.includes("YOUR_TELEGRAM_BOT_TOKEN")) {
	throw new Error("Set the TELEGRAM_BOT_TOKEN environment variable.");
}

// ============================
// Initialize OpenAI Client
// ============================

// ============================
// Initialize Telegraf Bot
// ============================
const bot = new Telegraf<Context<Update>>(TOKEN);

// ============================
// Command Handlers
// ============================

bot.command("start", startCommandHandler);

// ============================
// Message Handler
// ============================

bot.on("text", messageEventHandler);

// ============================
// Bot Entry Point
// ============================

async function main(): Promise<void> {
	logger.info("Bot is running...");
	await bot.launch();
}

// ============================
// Handle graceful shutdown
// ============================

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

main().catch((error) => {
	logger.error(`Bot failed to start: ${error}`);
	process.exit(1);
});
