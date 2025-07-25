import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Plan } from "./entities/Plan";
import { Invoice } from "./entities/Invoice";
import { DailyQuestion } from "./entities/DailyQuestion";
import { DailyQuestionGroup } from "./entities/DailyQuestionGroup";

const AppDataSource = new DataSource({
	type: "mysql",
	host: process.env.DB_HOST,
	port: +process.env.DB_PORT!,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	synchronize: true,
	logging: false,
	entities: [User, Plan, Invoice, DailyQuestion, DailyQuestionGroup],
});

AppDataSource.initialize()
	.then(() => {
		console.log("Data Source has been initialized!");
	})
	.catch((error) => {
		console.error("Error during Data Source initialization", error);
	});

export { AppDataSource };
