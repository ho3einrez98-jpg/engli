"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
require("dotenv/config");
const telegraf_1 = require("telegraf");
const start_command_handler_1 = require("./handlers/commands/start.command.handler");
const message_event_handler_1 = require("./handlers/events/message.event.handler");
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!TOKEN || TOKEN.includes("YOUR_TELEGRAM_BOT_TOKEN")) {
    throw new Error("Set the TELEGRAM_BOT_TOKEN environment variable.");
}
const bot = new telegraf_1.Telegraf(TOKEN);
exports.bot = bot;
// ============================
// Register Handlers
// ============================
bot.command("start", start_command_handler_1.startCommandHandler);
bot.on("text", message_event_handler_1.messageEventHandler);
