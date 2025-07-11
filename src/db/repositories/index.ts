import { AppDataSource } from "../data-source";
import { Invoice } from "../entities/Invoice";
import { Plan } from "../entities/Plan";
import { User } from "../entities/User";
import { InvoiceRepository } from "./InvoiceRepository";
import { PlanRepository } from "./PlanRepository";
import { UserRepository } from "./UserRepository";

const userRepo = new UserRepository(AppDataSource.getRepository(User));
const planRepo = new PlanRepository(AppDataSource.getRepository(Plan));
const invoiceRepo = new InvoiceRepository(AppDataSource.getRepository(Invoice));

export { invoiceRepo, planRepo, userRepo };
