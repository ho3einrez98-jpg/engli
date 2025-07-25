import { Repository, MoreThanOrEqual, LessThan, Between } from 'typeorm';
import { AppDataSource } from '../data-source';
import { DailyQuestion } from '../entities/DailyQuestion';

export class DailyQuestionRepository {
    private repository: Repository<DailyQuestion>;

    constructor() {
        this.repository = AppDataSource.getRepository(DailyQuestion);
    }

    async create(data: Partial<DailyQuestion>): Promise<DailyQuestion> {
        const question = this.repository.create(data);
        return await this.repository.save(question);
    }

    async findById(id: number): Promise<DailyQuestion | null> {
        return await this.repository.findOneBy({ id });
    }

    async findRecentByChatId(chatId: string, days: number = 7): Promise<DailyQuestion[]> {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        return await this.repository.find({
            where: {
                chatId,
                sentAt: MoreThanOrEqual(startDate)
            },
            order: { sentAt: 'DESC' }
        });
    }

    async getTodaysQuestion(chatId: string): Promise<DailyQuestion | null> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return await this.repository.findOne({
            where: {
                chatId,
                sentAt: Between(today, tomorrow)
            }
        });
    }

    async getQuestionStats(chatId: string, days: number = 30): Promise<{
        totalQuestions: number;
        averageResponses: number;
        mostEngagingType: string;
    }> {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const questions = await this.repository.find({
            where: {
                chatId,
                sentAt: MoreThanOrEqual(startDate)
            }
        });

        const totalQuestions = questions.length;
        const totalResponses = questions.reduce((sum, q) => sum + q.responseCount, 0);
        const averageResponses = totalQuestions > 0 ? totalResponses / totalQuestions : 0;

        const typeStats = questions.reduce((acc, q) => {
            acc[q.questionType] = (acc[q.questionType] || 0) + q.responseCount;
            return acc;
        }, {} as Record<string, number>);

        const mostEngagingType = Object.entries(typeStats)
            .sort(([,a], [,b]) => b - a)[0]?.[0] || 'vocabulary';

        return {
            totalQuestions,
            averageResponses,
            mostEngagingType
        };
    }

    async incrementResponseCount(id: number): Promise<void> {
        await this.repository.increment({ id }, 'responseCount', 1);
    }
}
