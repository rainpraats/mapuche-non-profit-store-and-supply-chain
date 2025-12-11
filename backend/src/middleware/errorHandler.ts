import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import AppError from '../models/appError.js';

const errorHandler: ErrorRequestHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let status = 'Internal Server Error';
  let message = 'Something went wrong';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    status = err.status;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    status,
    statusCode,
    message,
  });
};

export default errorHandler;
