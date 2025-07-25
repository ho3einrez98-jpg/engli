import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { logger } from "../../utils/logger";
import { getDailyQuestionService } from "../../daily-question-cron";

export async function dailyQuestionCommandHandler(ctx: Context<Update>) {
	try {
		// Only allow this command in groups
		if (ctx.chat?.type === "private") {
			await ctx.reply(
				"📚 Daily questions feature is only available in groups. Add me to a group and try again!"
			);
			return;
		}

		// Check if user is admin (optional - you might want to restrict this)
		const chatMember = await ctx.getChatMember(ctx.from!.id);
		if (!["creator", "administrator"].includes(chatMember.status)) {
			await ctx.reply("🔒 Only administrators can manage daily questions.");
			return;
		}

		const chatId = ctx.chat!.id.toString();
		const chatTitle = "title" in ctx.chat! ? ctx.chat!.title : undefined;

	await getDailyQuestionService().registerGroup(chatId, chatTitle);

		const message = `✅ <b>Daily Questions Enabled!</b>

📚 This group will now receive engaging English learning questions every day at 9:00 AM UTC.

🎯 <b>What to expect:</b>
• AI-generated questions designed to spark conversation
• Various topics: vocabulary, grammar, culture, conversation, and more
• Questions that encourage group participation and discussion

🔧 <b>Commands:</b>
• /question_stats - View group engagement statistics
• /disable_questions - Disable daily questions
• /manual_question - Send a question right now (admin only)

💡 <b>Tip:</b> The more your group participates, the better the AI gets at choosing questions you'll love!`;

		await ctx.reply(message, { parse_mode: "HTML" });
		logger.info(`Daily questions enabled for group ${chatId} (${chatTitle})`);
	} catch (error) {
		logger.error(`Error in dailyQuestionCommandHandler: ${error}`);
		await ctx.reply(
			"❌ Sorry, there was an error setting up daily questions. Please try again later."
		);
	}
}
