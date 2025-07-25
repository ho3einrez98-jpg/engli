import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { translateToPersian } from "../../utils/translate-to-persian";
import { logger } from "../../utils/logger";
import { translationCache } from "../../utils/translation-cache";

export const translateCallbackHandler = async (ctx: Context<Update>) => {
	try {
		// Check if it's a callback query
		if (!ctx.callbackQuery || !("data" in ctx.callbackQuery)) {
			await ctx.answerCbQuery("❌ Invalid callback query");
			return;
		}

		const callbackData = ctx.callbackQuery.data;

		// Extract the text to translate from callback data
		// Format: "translate:translation_id"
		if (!callbackData.startsWith("translate:")) {
			await ctx.answerCbQuery("❌ Invalid translation request");
			return;
		}

		const parts = callbackData.split(":");
		if (parts.length !== 2) {
			await ctx.answerCbQuery("❌ Invalid translation data format");
			return;
		}

		const translationId = parts[1];
		const translationData = translationCache.get(translationId);

		if (!translationData) {
			await ctx.answerCbQuery(
				"❌ Translation data expired. Please request correction again.",
				{ show_alert: true }
			);
			return;
		}

		const { originalText, correctedText } = translationData;

		// Show loading indicator
		await ctx.answerCbQuery("🔄 Translating to Persian...", { show_alert: false });

		// Translate the corrected text to Persian
		const { translation } = await translateToPersian(correctedText);

		if (!translation) {
			await ctx.answerCbQuery("❌ Translation failed. Please try again.", {
				show_alert: true,
			});
			return;
		}

		// Get the message to edit
		const messageToEdit = ctx.callbackQuery.message;
		if (!messageToEdit || !("text" in messageToEdit)) {
			await ctx.answerCbQuery("❌ Cannot edit message");
			return;
		}

		// Create the new message content with original, corrected, and Persian translation
		const newMessageText = `✅ ${correctedText}\n\n ${translation}`;

		// Edit the original message
		await ctx.editMessageText(newMessageText, {
			parse_mode: "HTML",
		});

		logger.info(
			`Translation completed - Original: ${originalText} | Corrected: ${correctedText} | Persian: ${translation}`
		);
	} catch (error) {
		logger.error(`Translation callback error: ${error}`);
		try {
			await ctx.answerCbQuery("❌ Translation error. Please try again.", { show_alert: true });
		} catch (cbError) {
			logger.error(`Callback query answer error: ${cbError}`);
		}
	}
};
