import { Repository } from "typeorm";
import { Plan } from "../entities/Plan";

export class PlanRepository extends Repository<Plan> {
	constructor(private readonly repo: Repository<Plan>) {
		super(repo.target, repo.manager, repo.queryRunner);
	}

	async findByName(name: string): Promise<Plan | null> {
		return this.repo.findOne({ where: { name } });
	}

	async getAllPlans(): Promise<Plan[]> {
		return this.repo.find();
	}
}
