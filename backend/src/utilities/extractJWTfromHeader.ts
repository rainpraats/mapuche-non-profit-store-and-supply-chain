import AppError from '../models/appError';

export const extractJWTFromHeader = (req: any): string => {
  let token = '';
  if (
    req.headers.authorization &&
    req.headers.authorization.toLowerCase().startsWith('bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Unauthorized, you are not logged in', 401);
  }

  return token;
};
