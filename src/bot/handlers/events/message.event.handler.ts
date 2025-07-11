import { detect } from "langdetect";
import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { logger } from "../../utils/logger";
import { messageQueue } from "../../utils/message-queue";

export const messageEventHandler = async (ctx: Context<Update>) => {
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
		const detection = detect(text);
		const lang = detection && detection.length > 0 ? detection[0].lang : null;
		if (lang !== "en") {
			logger.info(
				`Non-English input ignored: ${text} | Detected language: ${lang || "unknown"}`
			);
			return;
		}

		// Enqueue message
		if (!messageQueue.paused && messageQueue.length() < 100) {
			await messageQueue.push({ ctx, text });
			logger.info(`Enqueued message: ${text} | Queue size: ${messageQueue.length()}`);
		} else {
			logger.warn(`Queue full or paused, dropping message: ${text}`);
			await ctx.reply("⚠️ Bot is busy, please try again later.");
		}
	} catch (error) {
		logger.error(`Language detection error for text '${text}': ${error}`);
		await ctx.reply("❌ Error processing your message. Please try again.");
	}
};
