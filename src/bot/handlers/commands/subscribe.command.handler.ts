import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { subscribeUser } from "../../utils/subscribe-user";

export const subscribeCommandHandler = async (ctx: Context<Update>) => {
	await subscribeUser(ctx);
};
