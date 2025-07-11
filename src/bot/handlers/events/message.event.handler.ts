import { detect } from "langdetect";
import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { logger } from "../../utils/logger";
import { messageQueue } from "../../utils/message-queue";
import { subscribeUser } from "../../utils/subscribe-user";
import { unsubscribeUser } from "../../utils/unsubscribe-user";

export const messageEventHandler = async (ctx: Context<Update>) => {
	// check if the message is a text message
	if (!ctx.message || !("text" in ctx.message)) {
		await ctx.reply("❌ Please send a valid text message.");
		return;
	}

	// Handle keyboard button presses
	const text = ctx.message.text.trim();
	if (text === "Subscribe") {
		await subscribeUser(ctx);
		return;
	} else if (text === "Unsubscribe") {
		await unsubscribeUser(ctx);
		return;
	}

	// check if the message is from a group or supergroup
	const message = ctx.message;
	if (!["group", "supergroup"].includes(message.chat.type)) {
		return;
	}

	// check if the message is too short
	if (text.length < 5) {
		return;
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
			return;
		}

		// if the queue is full or paused, drop the message
		logger.warn(`Queue full or paused, dropping message: ${text}`);
		await ctx.reply("⚠️ Bot is busy, please try again later.", {
			reply_parameters: {
				message_id: ctx.message.message_id,
				chat_id: ctx.message.chat.id,
			},
		});
	} catch (error) {
		logger.error(`Language detection error for text '${text}': ${error}`);
		await ctx.reply("❌ Error processing your message. Please try again.", {
			reply_parameters: {
				message_id: ctx.message.message_id,
				chat_id: ctx.message.chat.id,
			},
		});
	}
};
