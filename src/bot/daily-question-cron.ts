import cron from "node-cron";
import { logger } from "./utils/logger";
import { DailyQuestionService } from "./services/daily-question.service";
import { Telegraf } from "telegraf";

let dailyQuestionService: DailyQuestionService | null = null;

// Initialize the service when bot is available
export function initializeDailyQuestionService(bot: Telegraf) {
	dailyQuestionService = new DailyQuestionService(bot);
}

// Getter function to access the service
export function getDailyQuestionService(): DailyQuestionService {
	if (!dailyQuestionService) {
		throw new Error(
			"Daily question service not initialized. Call initializeDailyQuestionService first."
		);
	}
	return dailyQuestionService;
}

// Run the cron job at 7:00 PM UTC every day
cron.schedule(
	"0 19 * * *",
	async () => {
		try {
			logger.info("Starting daily question cron job");
			await getDailyQuestionService().sendDailyQuestions();
			logger.info("Successfully completed daily question cron job");
		} catch (error) {
			logger.error(`Error in daily question cron job: ${error}`);
		}
	},
	{
		timezone: "UTC",
	}
);

export { dailyQuestionService };
