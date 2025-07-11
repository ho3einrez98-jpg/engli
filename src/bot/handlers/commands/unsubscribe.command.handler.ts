import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { handleUnsubscribe } from "../../callbacks/unsubscribe.callback";

export const unsubscribeCommandHandler = async (ctx: Context<Update>) => {
	await handleUnsubscribe(ctx);
};
