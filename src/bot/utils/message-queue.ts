import { queue } from "async";
import { MessageQueueItem } from "../interfaces";
import { correctSentence } from "./correct-sentence";
import { logger } from "./logger";

export const messageQueue = queue<MessageQueueItem>(
	async (item: MessageQueueItem, callback: () => void) => {
		try {
			const corrected = await correctSentence(item.text);
			if (corrected.corrected) {
				await item.ctx.reply(`Correction: ${corrected.corrected}`);
				logger.info(`Replied with correction: ${corrected.corrected}`);
				return;
			}

			logger.info(`No correction sent for: ${item.text}`);
		} catch (error) {
			logger.error(`Queue processing error for text '${item.text}': ${error}`);
		} finally {
			callback();
		}
	},
	1 // Concurrency set to 1 to process messages sequentially
);
