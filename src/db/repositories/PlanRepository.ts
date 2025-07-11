import { EntityRepository, Repository } from "typeorm";
import { Plan } from "../entities/Plan";

export class PlanRepository extends Repository<Plan> {
	async findByName(name: string): Promise<Plan | null> {
		return this.findOne({ where: { name } });
	}

	async getAllPlans(): Promise<Plan[]> {
		return this.find();
	}
}
