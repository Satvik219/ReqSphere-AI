import { GoogleGenAI } from '@google/genai';
import { config } from '../../config.js';

let client;

export function getGeminiClient() {
  if (client) return client;
  if (!config.gcpProjectId || !config.gcpLocation) {
    throw new Error('GCP_PROJECT_ID and GCP_LOCATION must be configured for Vertex AI.');
  }

  client = new GoogleGenAI({
    vertexai: true,
    project: config.gcpProjectId,
    location: config.gcpLocation,
    apiVersion: 'v1',
  });
  return client;
}

export async function generateText(contents, options = {}) {
  const response = await getGeminiClient().models.generateContent({
    model: config.geminiModel,
    contents,
    ...options,
  });
  const text = response.text?.trim();
  if (!text) throw new Error('Gemini returned an empty response.');
  return text;
}

export async function generateJson(contents, responseJsonSchema, options = {}) {
  const text = await generateText(contents, {
    ...options,
    config: {
      ...options.config,
      responseMimeType: 'application/json',
      responseJsonSchema,
    },
  });
  return text;
}