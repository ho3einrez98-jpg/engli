import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { AppDataSource } from "../../../db/data-source";
import { User } from "../../../db/entities/User";

export const unsubscribeCommandHandler = async (ctx: Context<Update>) => {
	const userId = ctx.from?.id;
	if (!userId) {
		await ctx.reply("❌ Unable to identify user.");
		return;
	}
	const userRepo = AppDataSource.getRepository(User);
	const user = await userRepo.findOne({ where: { telegramId: userId } });
	if (!user || !user.isPremium) {
		await ctx.reply("ℹ️ You are not a premium subscriber.");
		return;
	}
	user.isPremium = false;
	await userRepo.save(user);
	await ctx.reply("🛑 You have been unsubscribed from premium features.");
};
