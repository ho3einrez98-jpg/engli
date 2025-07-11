import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { addSubscriber, isSubscribed } from "../../utils/subscription-manager";

export const subscribeCommandHandler = async (ctx: Context<Update>) => {
	const userId = ctx.from?.id;
	if (!userId) {
		await ctx.reply("❌ Unable to identify user.");
		return;
	}
	if (isSubscribed(userId)) {
		await ctx.reply("✅ You are already a premium subscriber!");
		return;
	}
	addSubscriber(userId);
	await ctx.reply("🎉 You are now a premium subscriber! Enjoy advanced features.");
};
