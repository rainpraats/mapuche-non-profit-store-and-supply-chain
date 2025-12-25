import { NextFunction, Request, Response } from 'express';

export const healthCheck = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json({ success: true, statusCode: 200 });
};
