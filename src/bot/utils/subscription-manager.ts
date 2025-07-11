import fs from "fs";
import path from "path";

const SUBSCRIPTION_FILE = path.join(__dirname, "../../../subscribers.json");

function loadSubscribers(): Set<number> {
	try {
		const data = fs.readFileSync(SUBSCRIPTION_FILE, "utf-8");
		return new Set(JSON.parse(data));
	} catch {
		return new Set();
	}
}

function saveSubscribers(subscribers: Set<number>) {
	fs.writeFileSync(SUBSCRIPTION_FILE, JSON.stringify(Array.from(subscribers), null, 2));
}

export function isSubscribed(userId: number): boolean {
	const subscribers = loadSubscribers();
	return subscribers.has(userId);
}

export function addSubscriber(userId: number) {
	const subscribers = loadSubscribers();
	subscribers.add(userId);
	saveSubscribers(subscribers);
}

export function removeSubscriber(userId: number) {
	const subscribers = loadSubscribers();
	subscribers.delete(userId);
	saveSubscribers(subscribers);
}
