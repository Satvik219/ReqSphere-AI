import 'dotenv/config';
export const config = {
  port: Number(process.env.PORT ?? 8080),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  mock: process.env.USE_MOCK_SERVICES !== 'false',
  jwtSecret: process.env.JWT_SECRET ?? 'local-development-secret-change-me',
};
