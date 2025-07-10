import { OpenAI } from "openai";

const NSCALE_API_KEY = process.env.NSCALE_API_KEY;
const NSCALE_BASE_URL = process.env.NSCALE_BASE_URL;

if (!NSCALE_API_KEY || !NSCALE_BASE_URL) {
	throw new Error("Set the NSCALE_API_KEY and NSCALE_BASE_URL environment variables.");
}

export const openaiClient = new OpenAI({ apiKey: NSCALE_API_KEY, baseURL: NSCALE_BASE_URL });
