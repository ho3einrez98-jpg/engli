import { queue } from "async";
import { correctSentence } from "./correct-sentence";
import { logger } from "./logger";
import { MessageQueueItem } from "../interfaces/message-queue-item.interface";

export const messageQueue = queue<MessageQueueItem>(
	async (item: MessageQueueItem, callback: () => void) => {
		try {
			const { corrected } = await correctSentence(item.text);
			if (corrected) {
				await item.ctx.reply(`✅ ${corrected}`, {
					reply_parameters: {
						chat_id: item.ctx.chat?.id || 0,
						message_id: item.ctx.message?.message_id || 0,
					},
				});
				logger.info(`Replied with correction: ${corrected}`);
				return;
			}

			// Add like reaction for correct sentences
			try {
				if (item.ctx.message && "message_id" in item.ctx.message) {
					await item.ctx.telegram.setMessageReaction(
						item.ctx.chat?.id || 0,
						item.ctx.message.message_id,
						[{ type: "emoji", emoji: "👍" }]
					);
					logger.info(`Added like reaction to correct sentence: ${item.text}`);
				}
			} catch (reactionError) {
				// If reaction fails, log but don't throw error
				logger.warn(`Could not add reaction to message: ${reactionError}`);
			}
		} catch (error) {
			logger.error(`Queue processing error for text '${item.text}': ${error}`);
			await item.ctx.reply("❌ Error correcting your message. Please try again.");
		} finally {
			callback();
		}
	},
	1 // Concurrency set to 1 to process messages sequentially
);
