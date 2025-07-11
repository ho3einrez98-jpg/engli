import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { userRepo } from "../../db/repositories";

export const unsubscribeUser = async (ctx: Context<Update>) => {
	// check if user has a valid telegram id
	const userId = ctx.from?.id;
	if (!userId) {
		await ctx.reply("❌ Unable to identify user.");
		return;
	}

	// check if user has a valid telegram id
	const user = await userRepo.findByTelegramId(userId);
	if (!user || !user.isPremium) {
		await ctx.reply("ℹ️ You are not a premium subscriber.");
		return;
	}

	// set the user as not premium and inform the user
	await userRepo.setPremium(userId, false);
	await ctx.reply("🛑 You have been unsubscribed from premium features.");
};
