import { Telegraf, Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { logger } from "../utils/logger";
import { QuestionGeneratorService } from "./question-generator.service";
import { DailyQuestionGroupRepository } from "../../db/repositories/daily-question-group.repository";
import { DailyQuestionRepository } from "../../db/repositories/daily-question.repository";

export class DailyQuestionService {
	private questionGenerator: QuestionGeneratorService;
	private groupRepository: DailyQuestionGroupRepository;
	private questionRepository: DailyQuestionRepository;

	constructor(private bot: Telegraf<Context<Update>>) {
		this.questionGenerator = new QuestionGeneratorService();
		this.groupRepository = new DailyQuestionGroupRepository();
		this.questionRepository = new DailyQuestionRepository();
	}

	async registerGroup(
		chatId: string,
		chatTitle?: string,
		scheduledTime: string = "09:00",
		timezone: string = "UTC"
	): Promise<void> {
		try {
			const existingGroup = await this.groupRepository.findByChatId(chatId);

			if (existingGroup) {
				await this.groupRepository.update(existingGroup.id, {
					chatTitle,
					scheduledTime,
					timezone,
					isActive: true,
				});
				logger.info(`Updated daily question settings for group ${chatId}`);
			} else {
				await this.groupRepository.create({
					chatId,
					chatTitle,
					scheduledTime,
					timezone,
					isActive: true,
				});
				logger.info(`Registered new group ${chatId} for daily questions`);
			}
		} catch (error) {
			logger.error(`Failed to register group ${chatId}: ${error}`);
			throw error;
		}
	}

	async unregisterGroup(chatId: string): Promise<void> {
		try {
			await this.groupRepository.disableGroup(chatId);
			logger.info(`Disabled daily questions for group ${chatId}`);
		} catch (error) {
			logger.error(`Failed to unregister group ${chatId}: ${error}`);
			throw error;
		}
	}

	async sendDailyQuestions(): Promise<void> {
		try {
			const activeGroups = await this.groupRepository.findAllActive();
			logger.info(`Sending daily questions to ${activeGroups.length} active groups`);

			for (const group of activeGroups) {
				await this.sendQuestionToGroup(group.chatId);
				// Add delay between messages to avoid rate limiting
				await this.sleep(1000);
			}
		} catch (error) {
			logger.error(`Failed to send daily questions: ${error}`);
		}
	}

	private async sendQuestionToGroup(chatId: string): Promise<void> {
		try {
			// Check if question was already sent today
			const todaysQuestion = await this.questionRepository.getTodaysQuestion(chatId);
			if (todaysQuestion) {
				logger.info(`Question already sent today for group ${chatId}`);
				return;
			}

			// Get recent questions to avoid repetition
			const recentQuestions = await this.questionRepository.findRecentByChatId(chatId, 7);
			const recentQuestionTexts = recentQuestions.map((q) => q.question);

			// Get group stats to determine preferred question type
			const stats = await this.questionRepository.getQuestionStats(chatId);

			// Generate new question
			const generatedQuestion = await this.questionGenerator.generateDailyQuestion(
				recentQuestionTexts,
				stats.mostEngagingType,
				"intermediate" // Could be made configurable per group
			);

			// Send question to group
			const messageText = this.formatQuestionMessage(generatedQuestion.question);
			const sentMessage = await this.bot.telegram.sendMessage(chatId, messageText, {
				parse_mode: "HTML",
			});

			// Save question to database
			await this.questionRepository.create({
				question: generatedQuestion.question,
				questionType: generatedQuestion.type,
				difficulty: generatedQuestion.difficulty,
				chatId,
				messageId: sentMessage.message_id.toString(),
			});

			logger.info(`Daily question sent to group ${chatId}: ${generatedQuestion.type}`);
		} catch (error) {
			logger.error(`Failed to send question to group ${chatId}: ${error}`);
		}
	}

	private formatQuestionMessage(question: string): string {
		const header = "📚 <b>Daily English Question</b> 📚\n\n";
		const footer = "\n\n💬 <i>Share your thoughts and practice your English!</i>";

		return `${header}${question}${footer}`;
	}

	async sendThemedQuestion(chatId: string, theme: string): Promise<void> {
		try {
			const generatedQuestion = await this.questionGenerator.generateThemedQuestion(theme);
			const messageText = this.formatThemedQuestionMessage(generatedQuestion.question, theme);

			const sentMessage = await this.bot.telegram.sendMessage(chatId, messageText, {
				parse_mode: "HTML",
			});

			await this.questionRepository.create({
				question: generatedQuestion.question,
				questionType: generatedQuestion.type,
				difficulty: generatedQuestion.difficulty,
				chatId,
				messageId: sentMessage.message_id.toString(),
			});

			logger.info(`Themed question (${theme}) sent to group ${chatId}`);
		} catch (error) {
			logger.error(`Failed to send themed question to group ${chatId}: ${error}`);
			throw error;
		}
	}

	private formatThemedQuestionMessage(question: string, theme: string): string {
		const themeEmojis = {
			"monday-motivation": "💪",
			"wordplay-wednesday": "🎲",
			"throwback-thursday": "🕰️",
			"fun-friday": "🎉",
			"story-saturday": "📖",
			"reflection-sunday": "🧘",
		};

		const emoji = themeEmojis[theme as keyof typeof themeEmojis] || "📚";
		const themeName = theme
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");

		const header = `${emoji} <b>${themeName}</b> ${emoji}\n\n`;
		const footer = "\n\n💬 <i>Join the conversation and practice your English!</i>";

		return `${header}${question}${footer}`;
	}

	async getGroupStats(chatId: string): Promise<{
		totalQuestions: number;
		averageResponses: number;
		mostEngagingType: string;
		isRegistered: boolean;
	}> {
		try {
			const group = await this.groupRepository.findByChatId(chatId);
			const stats = await this.questionRepository.getQuestionStats(chatId);

			return {
				...stats,
				isRegistered: !!group?.isActive,
			};
		} catch (error) {
			logger.error(`Failed to get stats for group ${chatId}: ${error}`);
			return {
				totalQuestions: 0,
				averageResponses: 0,
				mostEngagingType: "conversation",
				isRegistered: false,
			};
		}
	}

	// Method to track engagement when users respond to questions
	async trackEngagement(chatId: string, messageId?: string): Promise<void> {
		try {
			if (!messageId) return;

			const question = await this.questionRepository.findById(parseInt(messageId));
			if (question) {
				await this.questionRepository.incrementResponseCount(question.id);
				logger.debug(`Incremented response count for question ${question.id}`);
			}
		} catch (error) {
			logger.error(`Failed to track engagement: ${error}`);
		}
	}

	private sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	// Method to manually send a question (for testing or admin use)
	async sendManualQuestion(
		chatId: string,
		questionType?: string,
		difficulty: string = "intermediate"
	): Promise<void> {
		try {
			const recentQuestions = await this.questionRepository.findRecentByChatId(chatId, 7);
			const recentQuestionTexts = recentQuestions.map((q) => q.question);

			const generatedQuestion = await this.questionGenerator.generateDailyQuestion(
				recentQuestionTexts,
				questionType,
				difficulty
			);

			const messageText = this.formatQuestionMessage(generatedQuestion.question);
			const sentMessage = await this.bot.telegram.sendMessage(chatId, messageText, {
				parse_mode: "HTML",
			});

			await this.questionRepository.create({
				question: generatedQuestion.question,
				questionType: generatedQuestion.type,
				difficulty: generatedQuestion.difficulty,
				chatId,
				messageId: sentMessage.message_id.toString(),
			});

			logger.info(`Manual question sent to group ${chatId}: ${generatedQuestion.type}`);
		} catch (error) {
			logger.error(`Failed to send manual question to group ${chatId}: ${error}`);
			throw error;
		}
	}
}
