import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ unique: true })
	telegramId!: number;

	@Column({ default: false })
	isPremium!: boolean;

	@CreateDateColumn()
	createdAt!: Date;
}
