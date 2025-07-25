import { AppDataSource } from "../data-source";
import { Invoice } from "../entities/Invoice";
import { Plan } from "../entities/Plan";
import { User } from "../entities/User";
import { DailyQuestion } from "../entities/DailyQuestion";
import { DailyQuestionGroup } from "../entities/DailyQuestionGroup";
import { InvoiceRepository } from "./invoice.repository";
import { PlanRepository } from "./plan.repository";
import { UserRepository } from "./user.repository";
import { DailyQuestionRepository } from "./daily-question.repository";
import { DailyQuestionGroupRepository } from "./daily-question-group.repository";

const userRepo = new UserRepository(AppDataSource.getRepository(User));
const planRepo = new PlanRepository(AppDataSource.getRepository(Plan));
const invoiceRepo = new InvoiceRepository(AppDataSource.getRepository(Invoice));
const dailyQuestionRepo = new DailyQuestionRepository();
const dailyQuestionGroupRepo = new DailyQuestionGroupRepository();

export { invoiceRepo, planRepo, userRepo, dailyQuestionRepo, dailyQuestionGroupRepo };
