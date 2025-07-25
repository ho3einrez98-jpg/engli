import { logger } from "./logger";
import { openaiClient } from "./openai-client";

export interface TranslationResponse {
	translation?: string;
	promptTokens: number;
	completionTokens: number;
	totalTokens: number;
}

export async function translateToPersian(
	text: string,
	retries: number = 2,
	delay: number = 2000
): Promise<TranslationResponse> {
	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			const response = await openaiClient.chat.completions.create({
				model: process.env.NSCALE_MODEL as string,
				messages: [
					{
						role: "system",
						content:
							"You are a professional English to Persian translator. Your task is to translate the provided English text into natural, fluent Persian (Farsi).\n\n" +
							"Translation guidelines:\n" +
							"- Translate accurately while maintaining the original meaning\n" +
							"- Use natural, conversational Persian\n" +
							"- Preserve the tone and style of the original text\n" +
							"- Use appropriate Persian grammar and sentence structure\n" +
							"- For technical terms, use commonly accepted Persian equivalents or keep the English term if widely used\n" +
							"- Maintain proper Persian punctuation and formatting\n\n" +
							"Output format:\n" +
							"- Provide ONLY the Persian translation\n" +
							"- Do not include explanations, notes, or the original English text\n" +
							"- Do not add any additional commentary",
					},
					{
						role: "user",
						content: text,
					},
				],
				max_tokens: 2000,
				temperature: 0.3,
			});

			const content = response.choices[0]?.message.content?.trim();
			if (content) {
				const usage = response.usage;
				logger.info(
					`Translation - Input: ${text} | Persian: ${content} | Tokens: prompt=${usage?.prompt_tokens}, completion=${usage?.completion_tokens}, total=${usage?.total_tokens}`
				);
				return {
					translation: content,
					promptTokens: usage?.prompt_tokens || 0,
					completionTokens: usage?.completion_tokens || 0,
					totalTokens: usage?.total_tokens || 0,
				};
			} else {
				logger.error(`Empty or invalid translation response: ${JSON.stringify(response)}`);
				return {
					promptTokens: 0,
					completionTokens: 0,
					totalTokens: 0,
				};
			}
		} catch (error) {
			logger.error(`Translation attempt ${attempt + 1}/${retries + 1} failed: ${error}`);
			if (attempt < retries) {
				await new Promise((resolve) => setTimeout(resolve, delay));
			} else {
				return {
					promptTokens: 0,
					completionTokens: 0,
					totalTokens: 0,
				};
			}
		}
	}
	return {
		promptTokens: 0,
		completionTokens: 0,
		totalTokens: 0,
	};
}
