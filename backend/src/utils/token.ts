// utils/token.ts
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from './config';

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generateJWT(userId: string): string {
  return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: '7d' });
}