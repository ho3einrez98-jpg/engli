import { Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { logger } from '../../utils/logger';
import { getDailyQuestionService } from '../../daily-question-cron';

export async function disableQuestionsCommandHandler(ctx: Context<Update>) {
    try {
        if (ctx.chat?.type === 'private') {
            await ctx.reply('📚 Daily questions feature is only available in groups.');
            return;
        }

        const chatMember = await ctx.getChatMember(ctx.from!.id);
        if (!['creator', 'administrator'].includes(chatMember.status)) {
            await ctx.reply('🔒 Only administrators can manage daily questions.');
            return;
        }

        const chatId = ctx.chat!.id.toString();
        await getDailyQuestionService().unregisterGroup(chatId);

        await ctx.reply('✅ Daily questions have been disabled for this group. You can enable them again anytime with /daily_questions');
        logger.info(`Daily questions disabled for group ${chatId}`);

    } catch (error) {
        logger.error(`Error in disableQuestionsCommandHandler: ${error}`);
        await ctx.reply('❌ Sorry, there was an error disabling daily questions. Please try again later.');
    }
}

export async function questionStatsCommandHandler(ctx: Context<Update>) {
    try {
        if (ctx.chat?.type === 'private') {
            await ctx.reply('📚 Question statistics are only available in groups.');
            return;
        }

        const chatId = ctx.chat!.id.toString();
        const stats = await getDailyQuestionService().getGroupStats(chatId);

        if (!stats.isRegistered) {
            await ctx.reply('📊 This group is not registered for daily questions. Use /daily_questions to enable them!');
            return;
        }

        const message = `📊 <b>Group Question Statistics</b>

🎯 <b>Overview (Last 30 days):</b>
• Total questions asked: ${stats.totalQuestions}
• Average responses per question: ${stats.averageResponses.toFixed(1)}
• Most engaging topic: ${stats.mostEngagingType}

${stats.totalQuestions > 0 
    ? '🌟 <b>Great job!</b> Keep the conversations going!' 
    : '💡 <b>Tip:</b> Participate more to see better statistics!'
}

Use /manual_question to get a question right now!`;

        await ctx.reply(message, { parse_mode: 'HTML' });

    } catch (error) {
        logger.error(`Error in questionStatsCommandHandler: ${error}`);
        await ctx.reply('❌ Sorry, there was an error getting statistics. Please try again later.');
    }
}

export async function manualQuestionCommandHandler(ctx: Context<Update>) {
    try {
        if (ctx.chat?.type === 'private') {
            await ctx.reply('📚 Manual questions are only available in groups.');
            return;
        }

        const chatMember = await ctx.getChatMember(ctx.from!.id);
        if (!['creator', 'administrator'].includes(chatMember.status)) {
            await ctx.reply('🔒 Only administrators can send manual questions.');
            return;
        }

        const chatId = ctx.chat!.id.toString();
        await ctx.reply('🎲 Generating a fresh question for your group...');

        await getDailyQuestionService().sendManualQuestion(chatId);
        
        logger.info(`Manual question sent to group ${chatId}`);

    } catch (error) {
        logger.error(`Error in manualQuestionCommandHandler: ${error}`);
        await ctx.reply('❌ Sorry, there was an error generating a question. Please try again later.');
    }
}

export async function themedQuestionCommandHandler(ctx: Context<Update>) {
    try {
        if (ctx.chat?.type === 'private') {
            await ctx.reply('📚 Themed questions are only available in groups.');
            return;
        }

        const chatMember = await ctx.getChatMember(ctx.from!.id);
        if (!['creator', 'administrator'].includes(chatMember.status)) {
            await ctx.reply('🔒 Only administrators can send themed questions.');
            return;
        }

        // Extract theme from command (e.g., /themed_question monday-motivation)
        const commandText = ctx.message && 'text' in ctx.message ? ctx.message.text : '';
        const theme = commandText.split(' ')[1];

        if (!theme) {
            const availableThemes = `📅 <b>Available Themed Questions:</b>

💪 monday-motivation - Start the week strong
🎲 wordplay-wednesday - Fun word games
🕰️ throwback-thursday - Share memories
🎉 fun-friday - Light and entertaining
📖 story-saturday - Creative storytelling
🧘 reflection-sunday - Thoughtful questions

<b>Usage:</b> /themed_question [theme]
<b>Example:</b> /themed_question fun-friday`;

            await ctx.reply(availableThemes, { parse_mode: 'HTML' });
            return;
        }

        const validThemes = ['monday-motivation', 'wordplay-wednesday', 'throwback-thursday', 'fun-friday', 'story-saturday', 'reflection-sunday'];
        
        if (!validThemes.includes(theme)) {
            await ctx.reply('❌ Invalid theme. Use /themed_question without parameters to see available themes.');
            return;
        }

        const chatId = ctx.chat!.id.toString();
        await ctx.reply(`🎨 Generating a ${theme.replace('-', ' ')} question...`);

        await getDailyQuestionService().sendThemedQuestion(chatId, theme);
        
        logger.info(`Themed question (${theme}) sent to group ${chatId}`);

    } catch (error) {
        logger.error(`Error in themedQuestionCommandHandler: ${error}`);
        await ctx.reply('❌ Sorry, there was an error generating the themed question. Please try again later.');
    }
}
