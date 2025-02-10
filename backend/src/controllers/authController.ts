import { auth } from '../db';
import { generateToken, generateJWT } from '../utils/token';
import { sendMagicLink } from '../utils/email';
import { config } from '../utils/config';
import { ParsedQs } from 'qs';
import { Request, Response } from 'express';

interface TokenRequest extends Request {
    query: {
      token?: string | string[] | ParsedQs | ParsedQs[]
    }
  }


  export const login =  async (req: Request, res:Response) => {
    try {
      const { email } = req.body;
      const token = generateToken();
      
      await auth.createToken({
        email,
        token,
        expiresAt: new Date(Date.now() + config.MAGIC_LINK_EXPIRY)
      });

      await sendMagicLink(email, token);
      
      res.json({ message: 'Magic link sent to your email' });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Failed to send magic link' });
    }
  }

  export const verifyToken = async (req: TokenRequest, res: Response): Promise<any> => {
    try {
      const { token } = req.query;
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: 'Invalid token' });
      }
  
      const storedToken = await auth.findToken(token);
      if (!storedToken || storedToken.expiresAt < new Date()) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }
  
      const user = await auth.findUser(storedToken.email);
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
      await auth.deleteToken(token);
      const jwt = generateJWT(user.id);
      
      res.json({id:user.id, is_admin:user.is_admin, token: jwt });
    } catch (error) {
      console.error('Verification error:', error);
      res.status(500).json({ error: 'Failed to verify token' });
    }
  }



