import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Plan {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ unique: true })
	name!: string;

	@Column()
	price!: number; // in cents

	@Column({ default: "USD" })
	currency!: string;

	@Column({ nullable: true })
	description?: string;

	@CreateDateColumn()
	createdAt!: Date;
}
