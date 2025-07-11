"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openaiClient = void 0;
require("dotenv/config");
const openai_1 = require("openai");
const NSCALE_API_KEY = process.env.NSCALE_API_KEY;
const NSCALE_BASE_URL = process.env.NSCALE_BASE_URL;
if (!NSCALE_API_KEY || !NSCALE_BASE_URL) {
    throw new Error("Set the NSCALE_API_KEY and NSCALE_BASE_URL environment variables.");
}
exports.openaiClient = new openai_1.OpenAI({ apiKey: NSCALE_API_KEY, baseURL: NSCALE_BASE_URL });
