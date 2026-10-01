import 'dotenv/config';
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error('JWT_SECRET must be set to a value with at least 32 characters.');
}

export const config = {
  port: Number(process.env.PORT ?? 8080),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  mock: process.env.USE_MOCK_SERVICES !== 'false',
  jwtSecret,
  gcpProjectId: process.env.GCP_PROJECT_ID ?? '',
  gcpLocation: process.env.GCP_LOCATION ?? '',
  geminiModel: process.env.GEMINI_MODEL ?? 'gemini-2.5-flash',
};
