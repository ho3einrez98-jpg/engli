export interface CorrectionResponse {
	corrected?: string;
	promptTokens: number;
	completionTokens: number;
	totalTokens: number;
}
