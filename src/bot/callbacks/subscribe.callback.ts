import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { userRepo } from "../../db/repositories";

export const handleSubscribe = async (ctx: Context<Update>) => {
	// check if user has a valid telegram id
	const userId = ctx.from?.id;
	if (!userId) {
		await ctx.reply("❌ Unable to identify user.");
		return;
	}

	// find the user and if not found, create a new user
	let user = await userRepo.findByTelegramId(userId);
	if (!user) {
		user = await userRepo.createUser(userId);
	}

	// if user is already premium, inform the user
	if (user.isPremium) {
		await ctx.reply("✅ You are already a premium subscriber!");
		return;
	}

	// set the user as premium and inform the user
	await userRepo.setPremium(userId, true);
	await ctx.reply("🎉 You are now a premium subscriber! Enjoy advanced features.");
};
