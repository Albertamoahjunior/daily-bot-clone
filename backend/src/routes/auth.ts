// routes/auth.ts
import express from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import {login, verifyToken} from '../controllers/authController';

const router = express.Router();

// Rate limiting for magic link requests
const magicLinkLimiter = rateLimit({
  windowMs: 60 * 60 * 10000, // 1 hour
  max: 5 // 5 requests per hour
});

router.post('/login', magicLinkLimiter, body('email').isEmail(), login );

router.get('/verify', verifyToken);

export default router;