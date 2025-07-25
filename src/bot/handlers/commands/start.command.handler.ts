import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";

export const startCommandHandler = async (ctx: Context<Update>) => {
	// const keyboard = {
	// 	reply_markup: {
	// 		keyboard: [
	// 			[{ text: "Subscribe" }, { text: "Unsubscribe" }],
	// 			// add more
	// 		],
	// 	},
	// };

	await ctx.reply(
		"سلام! 👋 من EngliFix هستم، یک بات تصحیح زبان انگلیسی 🚀 که با هوش مصنوعی فوق‌العاده قدرتمندی 💻 پشتیبانی می‌شه! \n" +
			"من رو به گروهت اضافه کن 📩 و من خطاهای گرامری رو مثل جادو 🪄 به‌صورت خودکار تصحیح می‌کنم! 😎\n" +
			"\n" +
			"توسعه‌دهنده: @h3nrzi 🧑‍💻"
	);
};
