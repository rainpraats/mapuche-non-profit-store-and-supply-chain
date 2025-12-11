import AppError from '../models/appError.js';
import mongoose from 'mongoose';

export const connectDb = async () => {
  try {
    console.log(process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI!);

    if (conn) {
      console.log(`Database connected to: ${conn.connection.host}`);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Database connection failed';
    throw new AppError(message, 500);
  }
};
