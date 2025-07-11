import { EntityRepository, Repository } from "typeorm";
import { Invoice } from "../entities/Invoice";

export class InvoiceRepository extends Repository<Invoice> {
	async findByProviderInvoiceId(providerInvoiceId: string): Promise<Invoice | null> {
		return this.findOne({ where: { providerInvoiceId } });
	}

	async createInvoice(invoiceData: Partial<Invoice>): Promise<Invoice> {
		const invoice = this.create(invoiceData);
		return this.save(invoice);
	}
}
