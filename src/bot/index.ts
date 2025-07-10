import "dotenv/config";
import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { startCommandHandler } from "./handlers/commands/start.command.handler";
import { messageEventHandler } from "./handlers/events/message.event.handler";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TOKEN || TOKEN.includes("YOUR_TELEGRAM_BOT_TOKEN")) {
	throw new Error("Set the TELEGRAM_BOT_TOKEN environment variable.");
}

const bot = new Telegraf<Context<Update>>(TOKEN);

// ============================
// Command Handlers
// ============================

bot.command("start", startCommandHandler);

// ============================
// Message Handler
// ============================

bot.on("text", messageEventHandler);

export { bot };
