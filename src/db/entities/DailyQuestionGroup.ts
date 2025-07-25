import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('daily_question_groups')
export class DailyQuestionGroup {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    chatId!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    chatTitle?: string;

    @Column({ type: 'varchar', length: 10, default: '09:00' })
    scheduledTime!: string; // Format: HH:MM

    @Column({ type: 'varchar', length: 50, default: 'UTC' })
    timezone!: string;

    @Column({ type: 'boolean', default: true })
    isActive!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
