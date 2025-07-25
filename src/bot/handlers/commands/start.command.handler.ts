import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";

export const startCommandHandler = async (ctx: Context<Update>) => {
	const isGroup = ctx.chat?.type === 'group' || ctx.chat?.type === 'supergroup';
	
	if (isGroup) {
		await ctx.reply(
			"سلام! 👋 من EngliFix هستم، یک بات تصحیح زبان انگلیسی 🚀 که با هوش مصنوعی فوق‌العاده قدرتمندی 💻 پشتیبانی می‌شه! \n" +
			"من رو به گروهت اضافه کن 📩 و من خطاهای گرامری رو مثل جادو 🪄 به‌صورت خودکار تصحیح می‌کنم! 😎\n" +
			"\n" +
			"📚 **ویژگی جدید - سؤالات روزانه انگلیسی:**\n" +
			"• /daily_questions - فعال‌سازی سؤالات روزانه\n" +
			"• /manual_question - دریافت سؤال فوری (فقط ادمین)\n" +
			"• /themed_question [theme] - سؤالات موضوعی\n" +
			"• /question_stats - آمار مشارکت گروه\n" +
			"• /disable_questions - غیرفعال‌سازی سؤالات\n" +
			"\n" +
			"توسعه‌دهنده: @h3nrzi 🧑‍💻"
		);
	} else {
		await ctx.reply(
			"سلام! 👋 من EngliFix هستم، یک بات تصحیح زبان انگلیسی 🚀 که با هوش مصنوعی فوق‌العاده قدرتمندی 💻 پشتیبانی می‌شه! \n" +
			"من رو به گروهت اضافه کن 📩 و من خطاهای گرامری رو مثل جادو 🪄 به‌صورت خودکار تصحیح می‌کنم! 😎\n" +
			"\n" +
			"📚 **برای دسترسی به سؤالات روزانه انگلیسی، من رو به گروه اضافه کن!**\n" +
			"\n" +
			"توسعه‌دهنده: @h3nrzi 🧑‍💻"
		);
	}
};
