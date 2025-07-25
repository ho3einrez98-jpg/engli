import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { explainCorrection } from "../../utils/explain-correction";
import { explanationCache } from "../../utils/explanation-cache";
import { logger } from "../../utils/logger";

export const explainCallbackHandler = async (ctx: Context<Update>) => {
	try {
		// Check if it's a callback query
		if (!ctx.callbackQuery || !("data" in ctx.callbackQuery)) {
			await ctx.answerCbQuery("❌ Invalid callback query");
			return;
		}

		const callbackData = ctx.callbackQuery.data;
		const userId = ctx.from?.id;

		if (!userId) {
			await ctx.answerCbQuery("❌ Unable to identify user");
			return;
		}

		// Extract the explanation ID from callback data
		// Format: "explain:explanation_id"
		if (!callbackData.startsWith("explain:")) {
			await ctx.answerCbQuery("❌ Invalid explanation request");
			return;
		}

		const parts = callbackData.split(":");
		if (parts.length !== 2) {
			await ctx.answerCbQuery("❌ Invalid explanation data format");
			return;
		}

		const explanationId = parts[1];
		const explanationData = explanationCache.get(explanationId);

		if (!explanationData) {
			await ctx.answerCbQuery(
				"❌ Explanation data expired. Please request explanation again.",
				{ show_alert: true }
			);
			return;
		}

		// Verify user owns this explanation request
		// if (explanationData.userId !== userId) {
		// 	await ctx.answerCbQuery("🔒 Only the owner of the explanation can request it.", {
		// 		show_alert: true,
		// 	});
		// 	return;
		// }

		// Check if user has premium access
		// const userRepo = AppDataSource.getRepository(User);
		// const user = await userRepo.findOne({ where: { telegramId: userId } });
		// if (!user || !user.isPremium) {
		// 	await ctx.answerCbQuery("🔒 This feature is for premium subscribers only.", {
		// 		show_alert: true,
		// 	});
		// 	return;
		// }

		// Show loading indicator
		await ctx.answerCbQuery("🔄 Generating explanation...", { show_alert: false });

		const { originalText } = explanationData;

		// Generate explanation if not already cached
		let correctedText = explanationData.correctedText;
		let explanation = explanationData.explanation;

		if (!correctedText || !explanation) {
			const result = await explainCorrection(originalText);
			correctedText = result.corrected;
			explanation = result.explanation;

			// Update cache with the explanation
			explanationCache.store(originalText, userId, correctedText, explanation);
		}

		if (!correctedText || !explanation) {
			await ctx.answerCbQuery("❌ Could not generate explanation. Please try again.", {
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

		// Create the new message content with original, corrected, and explanation
		const newMessageText = `📝 <b>Original:</b> ${originalText}\n\n✅ <b>Correction:</b> ${correctedText}\n\n🧠 <b>Explanation:</b>\n${explanation}`;

		// Edit the original message
		await ctx.editMessageText(newMessageText, {
			parse_mode: "HTML",
		});

		logger.info(
			`Explanation completed - Original: ${originalText} | Corrected: ${correctedText}`
		);
	} catch (error) {
		logger.error(`Explanation callback error: ${error}`);
		try {
			await ctx.answerCbQuery("❌ Explanation error. Please try again.", { show_alert: true });
		} catch (cbError) {
			logger.error(`Callback query answer error: ${cbError}`);
		}
	}
};
