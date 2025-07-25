import cron from 'node-cron';
import { bot } from './index';
import { logger } from './utils/logger';
import { DailyQuestionService } from './services/daily-question.service';

const dailyQuestionService = new DailyQuestionService(bot);

// Run the cron job at 9:00 AM UTC every day
cron.schedule('0 9 * * *', async () => {
    try {
        logger.info('Starting daily question cron job');
        await dailyQuestionService.sendDailyQuestions();
        logger.info('Successfully completed daily question cron job');
    } catch (error) {
        logger.error(`Error in daily question cron job: ${error}`);
    }
}, {
    timezone: 'UTC'
});

export { dailyQuestionService };

