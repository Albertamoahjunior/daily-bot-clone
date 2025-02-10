interface TokenRecord {
    email: string;
    token: string;
    expiresAt: Date;
  }
  
  interface User {
    id: string;
    email: string;
    createdAt: Date;
  }



declare namespace Express {

    export interface Request {
  
      user?: {
  
        id: string;
  
      };
  
    }
  
  }
  