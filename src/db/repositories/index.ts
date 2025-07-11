import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { UserRepository } from "./UserRepository";

const userRepo = new UserRepository(AppDataSource.getRepository(User));
// const planRepo = new PlanRepository(AppDataSource.getRepository(Plan));
// const invoiceRepo = new InvoiceRepository(AppDataSource.getRepository(Invoice));

export { userRepo };
