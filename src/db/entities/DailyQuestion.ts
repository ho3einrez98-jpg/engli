import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { DailyQuestionGroup } from "./DailyQuestionGroup";

@Entity("daily_questions")
export class DailyQuestion {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text' })
    question!: string;

    @Column({ type: 'varchar', length: 50 })
    questionType!: string; // e.g., 'vocabulary', 'grammar', 'idiom', 'conversation', etc.

    @Column({ type: 'varchar', length: 20 })
    difficulty!: string; // e.g., 'beginner', 'intermediate', 'advanced'

    @Column({ type: 'varchar', length: 255 })
    chatId!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    messageId?: string; // Telegram message ID

    @Column({ type: 'int', default: 0 })
    responseCount!: number; // Track engagement

    @CreateDateColumn()
    sentAt!: Date;

    @ManyToOne(() => DailyQuestionGroup)
    @JoinColumn({ name: 'chatId', referencedColumnName: 'chatId' })
    group?: DailyQuestionGroup;
}
