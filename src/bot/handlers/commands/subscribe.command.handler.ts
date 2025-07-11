import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { handleSubscribe } from "../../callbacks/subscribe.callback";

export const subscribeCommandHandler = async (ctx: Context<Update>) => {
	await handleSubscribe(ctx);
};
