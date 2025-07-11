import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { removeSubscriber, isSubscribed } from "../../utils/subscription-manager";

export const unsubscribeCommandHandler = async (ctx: Context<Update>) => {
	const userId = ctx.from?.id;
	if (!userId) {
		await ctx.reply("❌ Unable to identify user.");
		return;
	}
	if (!isSubscribed(userId)) {
		await ctx.reply("ℹ️ You are not a premium subscriber.");
		return;
	}
	removeSubscriber(userId);
	await ctx.reply("🛑 You have been unsubscribed from premium features.");
};
