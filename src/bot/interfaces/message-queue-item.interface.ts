import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";

export interface MessageQueueItem {
	ctx: Context<Update>;
	text: string;
}
