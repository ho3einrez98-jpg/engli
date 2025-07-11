import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { unsubscribeUser } from "../../utils/unsubscribe-user";

export const unsubscribeCommandHandler = async (ctx: Context<Update>) => {
	await unsubscribeUser(ctx);
};
