import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { AppDataSource } from "../../../db/data-source";
import { User } from "../../../db/entities/User";

export const subscribeCommandHandler = async (ctx: Context<Update>) => {
	const userId = ctx.from?.id;
	if (!userId) {
		await ctx.reply("❌ Unable to identify user.");
		return;
	}
	const userRepo = AppDataSource.getRepository(User);
	let user = await userRepo.findOne({ where: { telegramId: userId } });
	if (!user) {
		user = userRepo.create({ telegramId: userId, isPremium: true });
		await userRepo.save(user);
		await ctx.reply("🎉 You are now a premium subscriber! Enjoy advanced features.");
		return;
	}
	if (user.isPremium) {
		await ctx.reply("✅ You are already a premium subscriber!");
		return;
	}
	user.isPremium = true;
	await userRepo.save(user);
	await ctx.reply("🎉 You are now a premium subscriber! Enjoy advanced features.");
};
