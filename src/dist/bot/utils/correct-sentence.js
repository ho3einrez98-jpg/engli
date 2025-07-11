"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.correctSentence = correctSentence;
const logger_1 = require("./logger");
const openai_client_1 = require("./openai-client");
async function correctSentence(sentence, retries = 2, delay = 2000) {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await openai_client_1.openaiClient.chat.completions.create({
                model: process.env.NSCALE_MODEL,
                messages: [
                    {
                        role: "system",
                        content: "Correct the grammar and syntax of the input text. " +
                            "Output only the corrected text if changes are needed, " +
                            "or 'No correction needed' if the text is correct. " +
                            "Do not include reasoning, explanations, or extra text. " +
                            "For multi-sentence inputs, correct each sentence and return the full corrected text.",
                    },
                    { role: "user", content: sentence },
                ],
                max_tokens: 2000,
                temperature: 0.3,
            });
            const content = response.choices[0]?.message.content?.trim();
            if (content) {
                const usage = response.usage;
                logger_1.logger.info(`Input: ${sentence} | Response: ${content} | Tokens: prompt=${usage?.prompt_tokens}, completion=${usage?.completion_tokens}, total=${usage?.total_tokens}`);
                if (content.toLowerCase() !== sentence.toLowerCase() &&
                    ![
                        "no correction needed",
                        "no corrections needed",
                        "no change needed",
                        "no changes needed",
                        "",
                    ].includes(content.toLowerCase())) {
                    return {
                        corrected: content,
                        promptTokens: usage?.prompt_tokens || 0,
                        completionTokens: usage?.completion_tokens || 0,
                        totalTokens: usage?.total_tokens || 0,
                    };
                }
                return {
                    promptTokens: usage?.prompt_tokens || 0,
                    completionTokens: usage?.completion_tokens || 0,
                    totalTokens: usage?.total_tokens || 0,
                };
            }
            else {
                logger_1.logger.error(`Empty or invalid response from Nscale API: ${JSON.stringify(response)}`);
                return {
                    promptTokens: 0,
                    completionTokens: 0,
                    totalTokens: 0,
                };
            }
        }
        catch (error) {
            logger_1.logger.error(`Attempt ${attempt + 1}/${retries + 1} failed: ${error}`);
            if (attempt < retries) {
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
            else {
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
