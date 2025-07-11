import { Repository } from "typeorm";
import { User } from "../entities/User";

export class UserRepository extends Repository<User> {
	constructor(private readonly repo: Repository<User>) {
		super(repo.target, repo.manager, repo.queryRunner);
	}

	async findByTelegramId(telegramId: number): Promise<User | null> {
		return this.repo.findOne({ where: { telegramId } });
	}

	async createUser(telegramId: number): Promise<User> {
		const user = this.repo.create({ telegramId });
		return this.repo.save(user);
	}

	async setPremium(telegramId: number, isPremium: boolean): Promise<User | null> {
		const user = await this.findByTelegramId(telegramId);
		if (!user) return null;
		user.isPremium = isPremium;
		return this.repo.save(user);
	}
}
