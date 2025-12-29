import { JWT_EXPIRES, JWT_SECRET } from '../envVariables.js';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

export const createToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  } as SignOptions);
};

export const verifyToken = async (
  token: string
): Promise<JwtPayload & { id: string }> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      if (!decoded || typeof decoded === 'string') {
        return reject(new Error('Invalid token'));
      }
      resolve(decoded as JwtPayload & { id: string });
    });
  });
};
