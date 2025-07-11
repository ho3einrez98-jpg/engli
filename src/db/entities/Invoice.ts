import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Plan } from "./Plan";

@Entity()
export class Invoice {
	@PrimaryGeneratedColumn()
	id!: number;

	@ManyToOne(() => User)
	@JoinColumn({ name: "userId" })
	user!: User;

	@ManyToOne(() => Plan)
	@JoinColumn({ name: "planId" })
	plan!: Plan;

	@Column()
	amount!: number;

	@Column({ default: "USD" })
	currency!: string;

	@Column({ default: "pending" })
	status!: string;

	@Column({ nullable: true })
	providerInvoiceId?: string;

	@CreateDateColumn()
	createdAt!: Date;
}
