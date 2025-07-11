import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { AppDataSource } from "../../../db/data-source";
import { User } from "../../../db/entities/User";
import { explainCorrection } from "../../utils/correct-sentence";

export const explainCommandHandler = async (ctx: Context<Update>) => {
	const userId = ctx.from?.id;
	if (!userId) {
		await ctx.reply("❌ Unable to identify user.");
		return;
	}
	const userRepo = AppDataSource.getRepository(User);
	const user = await userRepo.findOne({ where: { telegramId: userId } });
	if (!user || !user.isPremium) {
		await ctx.reply("🔒 This feature is for premium subscribers only.", {
			reply_parameters: {
				chat_id: ctx.chat?.id || 0,
				message_id: ctx.message?.message_id || 0,
			},
		});
		return;
	}
	const text = ctx.message && "text" in ctx.message ? ctx.message.text : "";
	const input = text.replace(/^\/explain(@\w+)?\s*/i, "").trim();
	if (!input) {
		await ctx.reply(
			"ℹ️ Please provide a sentence to explain. Example: /explain I has a apple."
		);
		return;
	}
	await ctx.reply("⏳ Analyzing your sentence and preparing an explanation...", {
		reply_parameters: {
			chat_id: ctx.chat?.id || 0,
			message_id: ctx.message?.message_id || 0,
		},
	});
	const result = await explainCorrection(input);
	if (result.corrected || result.explanation) {
		let reply = "";
		if (result.corrected) reply += `✅ Correction: ${result.corrected}\n`;
		if (result.explanation) reply += `💡 Explanation: ${result.explanation}`;
		await ctx.reply(reply, {
			reply_parameters: {
				chat_id: ctx.chat?.id || 0,
				message_id: ctx.message?.message_id || 0,
			},
		});
		return;
	}

	await ctx.reply("❌ Could not generate an explanation. Please try again later.");
};
