import { logger } from "../utils/logger";
import { openaiClient } from "../utils/openai-client";

export interface GeneratedQuestion {
    question: string;
    type: string;
    difficulty: string;
    expectedEngagement: number;
}

export class QuestionGeneratorService {
    private readonly questionTypes = [
        'vocabulary',
        'grammar',
        'idioms',
        'pronunciation',
        'conversation',
        'culture',
        'writing',
        'listening'
    ];

    private readonly difficulties = ['beginner', 'intermediate', 'advanced'];

    async generateDailyQuestion(
        previousQuestions: string[] = [],
        preferredType?: string,
        difficulty: string = 'intermediate'
    ): Promise<GeneratedQuestion> {
        try {
            const questionType = preferredType || this.getRandomQuestionType();
            
            const systemPrompt = this.buildSystemPrompt(previousQuestions, questionType, difficulty);
            
            const response = await openaiClient.chat.completions.create({
                model: process.env.NSCALE_MODEL as string,
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: `Generate a ${difficulty} level ${questionType} question that will encourage group participation and discussion.`
                    }
                ],
                max_tokens: 1000,
                temperature: 0.8, // Higher creativity for varied questions
            });

            const content = response.choices[0]?.message.content?.trim();
            
            if (!content) {
                throw new Error('Empty response from AI');
            }

            const parsedQuestion = this.parseQuestionResponse(content, questionType, difficulty);
            
            logger.info(`Generated daily question - Type: ${parsedQuestion.type}, Difficulty: ${parsedQuestion.difficulty}`);
            
            return parsedQuestion;

        } catch (error) {
            logger.error(`Failed to generate daily question: ${error}`);
            // Fallback to a preset question
            return this.getFallbackQuestion(difficulty);
        }
    }

    private buildSystemPrompt(previousQuestions: string[], questionType: string, difficulty: string): string {
        const basePrompt = `You are an expert English teacher creating engaging daily questions for a Telegram group focused on English learning. Your goal is to create questions that will spark conversation and encourage active participation from group members.

Guidelines:
- Create questions that are interactive and discussion-worthy
- Make questions that learners WANT to answer and share their thoughts
- Use emojis to make questions more engaging and fun
- Avoid questions that have simple yes/no answers
- Encourage creativity and personal expression
- Questions should be suitable for group chat environment
- Focus on practical, real-world English usage

Question Type: ${questionType}
Difficulty Level: ${difficulty}

Response Format:
Return ONLY the question text, nothing else. Make it engaging, clear, and conversation-starter friendly.

Examples of engaging question starters:
- "🤔 What's the most..."
- "💭 How would you describe..."
- "🗣️ Share a time when..."
- "🌟 What's your favorite..."
- "🎯 If you could..."
- "📚 Complete this sentence..."
- "🔤 Use these words in a sentence..."
- "💡 What's the difference between..."`;

        if (previousQuestions.length > 0) {
            return basePrompt + `\n\nRecent questions asked (avoid similar topics):\n` + 
                   previousQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n');
        }

        return basePrompt;
    }

    private parseQuestionResponse(content: string, questionType: string, difficulty: string): GeneratedQuestion {
        // Clean up the response and extract the main question
        const question = content.replace(/^(Question:|Q:)\s*/i, '').trim();
        
        // Estimate engagement based on question characteristics
        const expectedEngagement = this.estimateEngagement(question, questionType);

        return {
            question,
            type: questionType,
            difficulty,
            expectedEngagement
        };
    }

    private estimateEngagement(question: string, type: string): number {
        let score = 5; // Base score

        // Questions with emojis tend to get more engagement
        const emojiCount = (question.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length;
        score += emojiCount * 0.5;

        // Personal/opinion questions get higher engagement
        if (question.toLowerCase().includes('your') || question.toLowerCase().includes('you')) {
            score += 2;
        }

        // Open-ended questions score higher
        if (question.includes('how') || question.includes('what') || question.includes('why') || question.includes('describe')) {
            score += 1.5;
        }

        // Conversation and culture questions typically get more responses
        if (type === 'conversation' || type === 'culture') {
            score += 1;
        }

        return Math.min(10, Math.max(1, Math.round(score)));
    }

    private getRandomQuestionType(): string {
        return this.questionTypes[Math.floor(Math.random() * this.questionTypes.length)];
    }

    private getFallbackQuestion(difficulty: string): GeneratedQuestion {
        const fallbackQuestions = {
            beginner: "🌟 What's your favorite English word and why? Share it with us!",
            intermediate: "🤔 Describe your perfect day using at least 5 different adjectives. Let's see your creativity!",
            advanced: "💭 If you could have dinner with any English-speaking historical figure, who would it be and what would you discuss?"
        };

        return {
            question: fallbackQuestions[difficulty as keyof typeof fallbackQuestions] || fallbackQuestions.intermediate,
            type: 'conversation',
            difficulty,
            expectedEngagement: 7
        };
    }

    // Method to generate themed questions for special occasions
    async generateThemedQuestion(theme: string, difficulty: string = 'intermediate'): Promise<GeneratedQuestion> {
        const themes = {
            'monday-motivation': 'motivational questions to start the week',
            'wordplay-wednesday': 'fun wordplay and vocabulary games',
            'throwback-thursday': 'questions about past experiences',
            'fun-friday': 'light-hearted and entertaining questions',
            'story-saturday': 'creative storytelling prompts',
            'reflection-sunday': 'thoughtful reflection questions'
        };

        const themeDescription = themes[theme as keyof typeof themes] || 'general English learning';

        try {
            const response = await openaiClient.chat.completions.create({
                model: process.env.NSCALE_MODEL as string,
                messages: [
                    {
                        role: "system",
                        content: `Create an engaging ${difficulty} level English learning question with a ${themeDescription} theme. Make it perfect for group discussion and participation.`
                    }
                ],
                max_tokens: 200,
                temperature: 0.8,
            });

            const content = response.choices[0]?.message.content?.trim();
            
            if (!content) {
                return this.getFallbackQuestion(difficulty);
            }

            return {
                question: content,
                type: theme,
                difficulty,
                expectedEngagement: 8
            };

        } catch (error) {
            logger.error(`Failed to generate themed question: ${error}`);
            return this.getFallbackQuestion(difficulty);
        }
    }
}
