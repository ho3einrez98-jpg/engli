"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageEventHandler = void 0;
const langdetect_1 = require("langdetect");
const logger_1 = require("../../utils/logger");
const message_queue_1 = require("../../utils/message-queue");
const messageEventHandler = async (ctx) => {
    if (!ctx.message || !("text" in ctx.message)) {
        await ctx.reply("❌ Please send a valid text message.");
        return;
    }
    const message = ctx.message;
    if (!["group", "supergroup"].includes(message.chat.type)) {
        return;
    }
    const text = message.text.trim();
    if (text.length < 5) {
        return; // Ignore short messages
    }
    try {
        // Detect language of the input text
        const detection = (0, langdetect_1.detect)(text);
        const lang = detection && detection.length > 0 ? detection[0].lang : null;
        if (lang !== "en") {
            logger_1.logger.info(`Non-English input ignored: ${text} | Detected language: ${lang || "unknown"}`);
            return;
        }
        // Enqueue message
        if (!message_queue_1.messageQueue.paused && message_queue_1.messageQueue.length() < 100) {
            await message_queue_1.messageQueue.push({ ctx, text });
            logger_1.logger.info(`Enqueued message: ${text} | Queue size: ${message_queue_1.messageQueue.length()}`);
        }
        else {
            logger_1.logger.warn(`Queue full or paused, dropping message: ${text}`);
            await ctx.reply("⚠️ Bot is busy, please try again later.");
        }
    }
    catch (error) {
        logger_1.logger.error(`Language detection error for text '${text}': ${error}`);
        await ctx.reply("❌ Error processing your message. Please try again.");
    }
};
exports.messageEventHandler = messageEventHandler;
