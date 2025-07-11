"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageQueue = void 0;
const async_1 = require("async");
const correct_sentence_1 = require("./correct-sentence");
const logger_1 = require("./logger");
exports.messageQueue = (0, async_1.queue)(async (item, callback) => {
    try {
        const { corrected } = await (0, correct_sentence_1.correctSentence)(item.text);
        if (corrected) {
            await item.ctx.reply(`✅ ${corrected}`, {
                reply_parameters: {
                    chat_id: item.ctx.chat?.id || 0,
                    message_id: item.ctx.message?.message_id || 0,
                },
            });
            logger_1.logger.info(`Replied with correction: ${corrected}`);
            return;
        }
        logger_1.logger.info(`No correction sent for: ${item.text}`);
    }
    catch (error) {
        logger_1.logger.error(`Queue processing error for text '${item.text}': ${error}`);
        await item.ctx.reply("❌ Error correcting your message. Please try again.");
    }
    finally {
        callback();
    }
}, 1 // Concurrency set to 1 to process messages sequentially
);
