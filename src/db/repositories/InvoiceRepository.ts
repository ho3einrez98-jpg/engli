import { Repository } from "typeorm";
import { Invoice } from "../entities/Invoice";

export class InvoiceRepository extends Repository<Invoice> {
	constructor(private readonly repo: Repository<Invoice>) {
		super(repo.target, repo.manager, repo.queryRunner);
	}

	async findByProviderInvoiceId(providerInvoiceId: string): Promise<Invoice | null> {
		return this.repo.findOne({ where: { providerInvoiceId } });
	}

	async createInvoice(invoiceData: Partial<Invoice>): Promise<Invoice> {
		const invoice = this.repo.create(invoiceData);
		return this.repo.save(invoice);
	}
}
