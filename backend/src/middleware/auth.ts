// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../utils/config';


    interface AuthRequest extends Request {
  
      user?: {
  
        id: string;
  
      };
  
    }
  
  
export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, config.JWT_SECRET) as { userId: string };
    req.user = { id: payload.userId };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
    return
  }
}