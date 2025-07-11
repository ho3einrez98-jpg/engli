import { EntityRepository, Repository } from "typeorm";
import { User } from "../entities/User";

export class UserRepository extends Repository<User> {
	async findByTelegramId(telegramId: number): Promise<User | null> {
		return this.findOne({ where: { telegramId } });
	}

	async createUser(telegramId: number): Promise<User> {
		const user = this.create({ telegramId });
		return this.save(user);
	}

	async setPremium(telegramId: number, isPremium: boolean): Promise<User | null> {
		const user = await this.findByTelegramId(telegramId);
		if (!user) return null;
		user.isPremium = isPremium;
		return this.save(user);
	}
}
