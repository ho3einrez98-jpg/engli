import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { DailyQuestionGroup } from "../entities/DailyQuestionGroup";

export class DailyQuestionGroupRepository {
	private repository: Repository<DailyQuestionGroup>;

	constructor() {
		this.repository = AppDataSource.getRepository(DailyQuestionGroup);
	}

	async create(data: Partial<DailyQuestionGroup>): Promise<DailyQuestionGroup> {
		const group = this.repository.create(data);
		return await this.repository.save(group);
	}

	async findById(id: number): Promise<DailyQuestionGroup | null> {
		return await this.repository.findOneBy({ id });
	}

	async findByChatId(chatId: string): Promise<DailyQuestionGroup | null> {
		return await this.repository.findOneBy({ chatId });
	}

	async findAllActive(): Promise<DailyQuestionGroup[]> {
		return await this.repository.find({
			where: { isActive: true },
			order: { scheduledTime: "ASC" },
		});
	}

	async update(id: number, data: Partial<DailyQuestionGroup>): Promise<void> {
		await this.repository.update(id, data);
	}

	async delete(id: number): Promise<void> {
		await this.repository.delete(id);
	}

	async enableGroup(chatId: string): Promise<void> {
		await this.repository.update({ chatId }, { isActive: true });
	}

	async disableGroup(chatId: string): Promise<void> {
		await this.repository.update({ chatId }, { isActive: false });
	}
}
