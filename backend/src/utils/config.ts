// config.ts
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@yourapp.com',
  MAGIC_LINK_EXPIRY: 15 * 60 * 1000, // 15 minutes
  BASE_URL: process.env.BASE_URL || 'http://localhost:3000'
};