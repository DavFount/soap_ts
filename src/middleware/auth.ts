import { Request, Response, NextFunction } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';

export interface CustomeRequest extends Request {
  token: string | JwtPayload;
}

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('x-auth-token');

    if (!token) {
      return res.status(401).json({ msg: 'No token, Authorization Denied' });
    }

    const decoded = verify(token, process.env.SECRET_KEY);
    (req as CustomeRequest).token = decoded;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
