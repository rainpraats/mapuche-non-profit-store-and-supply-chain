import { promisify } from 'util';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { catchErrorAsync } from '../utilities/catchErrorAsync.js';
import AppError from '../models/appError.js';
import UserRepository from '../repositories/userRepository.js';
import { userRoles } from '../models/userRoles';
import { Response, NextFunction } from 'express';
import { JWT_EXPIRES, JWT_SECRET } from '../envVariables.js';
import { extractJWTFromHeader } from '../utilities/extractJWTfromHeader.js';

export const loginUser = catchErrorAsync(async (req, res, next) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return next(new AppError('Name and password required', 400));
  }

  const user = await new UserRepository().find(name, true);

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError('Incorrect name or password', 401));
  }

  const token = createToken(user._id.toString());

  res
    .status(200)
    .json({ success: true, statusCode: 200, data: { token: token } });
});

export const protect = catchErrorAsync(async (req: any, res, next) => {
  const token = extractJWTFromHeader(req);

  const decoded = await verifyToken(token);

  const user = await new UserRepository().findById(decoded.id);

  req.user = user;

  next();
});

export const authorize = (...roles: userRoles[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'Forbidden. Insufficient permissions to access the given resource',
          403
        )
      );
    }
    next();
  };
};

const createToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  } as SignOptions);
};

const verifyToken = async (
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

export const getCurrentUser = catchErrorAsync(async (req, res, next) => {
  const token = extractJWTFromHeader(req);

  const decoded = await verifyToken(token);

  const user = await new UserRepository().findById(decoded.id);

  if (!user) {
    throw new AppError('Unauthorized, you are not logged in', 401);
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    data: {
      user: {
        name: user.name,
        role: user.role,
        memberSince: user.memberSince,
      },
    },
  });
});

export const deleteCurrentUser = catchErrorAsync(async (req, res, next) => {
  const token = extractJWTFromHeader(req);

  const decoded = await verifyToken(token);

  await new UserRepository().deleteById(decoded.id);

  res.status(204).end();
});
