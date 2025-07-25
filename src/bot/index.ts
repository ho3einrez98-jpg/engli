import "dotenv/config";
import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { startCommandHandler } from "./handlers/commands/start.command.handler";
import { messageEventHandler } from "./handlers/events/message.event.handler";
import { subscribeCommandHandler } from "./handlers/commands/subscribe.command.handler";
import { unsubscribeCommandHandler } from "./handlers/commands/unsubscribe.command.handler";
import { translateCallbackHandler } from "./handlers/callbacks/translate.callback.handler";
import { explainCallbackHandler } from "./handlers/callbacks/explain.callback.handler";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TOKEN || TOKEN.includes("YOUR_TELEGRAM_BOT_TOKEN")) {
	throw new Error("Set the TELEGRAM_BOT_TOKEN environment variable.");
}

const bot = new Telegraf<Context<Update>>(TOKEN);

// ============================
// Register Handlers
// ============================

bot.command("start", startCommandHandler);
bot.command("subscribe", subscribeCommandHandler);
bot.command("unsubscribe", unsubscribeCommandHandler);
bot.action(/^translate:/, translateCallbackHandler);
bot.action(/^explain:/, explainCallbackHandler);
bot.on("text", messageEventHandler);

export { bot };
