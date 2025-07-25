import { logger } from "./logger";

interface ExplanationData {
	originalText: string;
	correctedText?: string;
	explanation?: string;
	userId: number;
	timestamp: number;
}

// Simple in-memory cache for explanation data
// In production, you might want to use Redis or similar
class ExplanationCache {
	private cache = new Map<string, ExplanationData>();
	private readonly TTL = 60 * 60 * 1000; // 1 hour in milliseconds

	// Generate a short unique ID for the callback data
	private generateId(): string {
		return Math.random().toString(36).substring(2, 8);
	}

	// Store explanation data and return a short ID
	store(
		originalText: string,
		userId: number,
		correctedText?: string,
		explanation?: string
	): string {
		const id = this.generateId();
		this.cache.set(id, {
			originalText,
			correctedText,
			explanation,
			userId,
			timestamp: Date.now(),
		});

		logger.info(`Stored explanation data with ID: ${id}`);

		// Clean up expired entries
		this.cleanup();

		return id;
	}

	// Retrieve explanation data by ID
	get(id: string): ExplanationData | null {
		const data = this.cache.get(id);

		if (!data) {
			return null;
		}

		// Check if data has expired
		if (Date.now() - data.timestamp > this.TTL) {
			this.cache.delete(id);
			return null;
		}

		return data;
	}

	// Clean up expired entries
	private cleanup(): void {
		const now = Date.now();
		for (const [id, data] of this.cache.entries()) {
			if (now - data.timestamp > this.TTL) {
				this.cache.delete(id);
			}
		}
	}

	// Get cache size for monitoring
	size(): number {
		return this.cache.size;
	}
}

export const explanationCache = new ExplanationCache();
