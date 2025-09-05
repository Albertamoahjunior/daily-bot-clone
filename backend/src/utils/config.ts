// config.ts
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  JWT_SECRET: process.env.JWT_SECRET || 'secret-key',
  EMAIL_FROM: process.env.EMAIL_FROM || 'info@elropheka.online',
  MAGIC_LINK_EXPIRY: 15 * 60 * 1000, // 15 minutes
  BASE_URL: process.env.BASE_URL || 'http://localhost:5173'
};