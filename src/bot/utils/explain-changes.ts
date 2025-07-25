import { logger } from "./logger";
import { openaiClient } from "./openai-client";

export async function explainChanges(
	sentence: string,
	retries: number = 2,
	delay: number = 2000
): Promise<{
	corrected?: string;
	explanation?: string;
	promptTokens: number;
	completionTokens: number;
	totalTokens: number;
}> {
	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			const response = await openaiClient.chat.completions.create({
				model: process.env.NSCALE_MODEL as string,
				messages: [
					{
						role: "system",
						content:
							"You are an expert English grammar and writing assistant. Your task is to correct grammar, syntax, punctuation, and spelling errors in the provided text while preserving the original meaning and tone, then explain your changes.\n\n" +
							"Correction guidelines:\n" +
							"- Fix grammatical errors (subject-verb agreement, tense consistency, etc.)\n" +
							"- Correct punctuation and capitalization\n" +
							"- Fix spelling mistakes\n" +
							"- Improve sentence structure when necessary\n" +
							"- Maintain the original meaning, tone, and style\n" +
							"- Do not add new information or change the intent\n" +
							"- For informal text, preserve appropriate casualness\n\n" +
							"Response format (Markdown):\n" +
							"Return a single Markdown block that includes both the correction and the explanation, formatted as follows:\n" +
							"✅ Correction:  \n<corrected sentence>  \n\n🧠 Explanation:  \n- <bullet point explanation 1>  \n- <bullet point explanation 2>  \n- ...\n" +
							"If no corrections are needed, output: 'Correction: No correction needed\\nExplanation: The text is already grammatically correct and well-structured.'",
					},
					{ role: "user", content: sentence },
				],
				max_tokens: 2000,
				temperature: 0.3,
			});
			const content = response.choices[0]?.message.content?.trim();
			const usage = response.usage;
			if (content) {
				let corrected, explanation;
				if (content.toLowerCase().startsWith("no correction needed")) {
					explanation = content;
				} else {
					const match = content.match(/^Correction:\s*(.+?)\nExplanation:\s*([\s\S]*)$/i);
					if (match) {
						corrected = match[1].trim();
						explanation = match[2].trim();
					} else {
						corrected = content;
					}
				}
				logger.info(
					`Input: ${sentence} | Correction: ${corrected} | Explanation: ${explanation} | Tokens: prompt=${usage?.prompt_tokens}, completion=${usage?.completion_tokens}, total=${usage?.total_tokens}`
				);
				return {
					corrected,
					explanation,
					promptTokens: usage?.prompt_tokens || 0,
					completionTokens: usage?.completion_tokens || 0,
					totalTokens: usage?.total_tokens || 0,
				};
			} else {
				logger.error(`Empty or invalid response from Nscale API: ${JSON.stringify(response)}`);
				return {
					promptTokens: 0,
					completionTokens: 0,
					totalTokens: 0,
				};
			}
		} catch (error) {
			logger.error(`Attempt ${attempt + 1}/${retries + 1} failed: ${error}`);
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
