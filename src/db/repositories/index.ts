import { AppDataSource } from "../data-source";
import { Invoice } from "../entities/Invoice";
import { Plan } from "../entities/Plan";
import { User } from "../entities/User";
import { InvoiceRepository } from "./invoice.repository";
import { PlanRepository } from "./plan.repository";
import { UserRepository } from "./user.repository";

const userRepo = new UserRepository(AppDataSource.getRepository(User));
const planRepo = new PlanRepository(AppDataSource.getRepository(Plan));
const invoiceRepo = new InvoiceRepository(AppDataSource.getRepository(Invoice));

export { invoiceRepo, planRepo, userRepo };
