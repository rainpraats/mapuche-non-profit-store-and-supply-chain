import errorHandler from './middleware/errorHandler.js';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { xss } from 'express-xss-sanitizer';
import helmet from 'helmet';
import hpp from 'hpp';
import router from './router';
import { logger } from './middleware/logger.js';
import { connectDb } from './database/db.js';
import { NODE_ENV, PORT } from './envVariables.js';

const startServer = async () => {
  try {
    await connectDb();

    const app = express();

    app.use(helmet());
    app.use(cors());
    app.use('/api/', rateLimit({ max: 1000, windowMs: 60 * 60 * 1000 }));
    app.use(express.json({ limit: '1mb' }));
    app.use(mongoSanitize());
    app.use(xss());
    app.use(hpp());

    if (NODE_ENV === 'development') {
      app.use(logger);
    }

    app.use('/api/v1', router);

    app.use(errorHandler);

    app.listen(PORT, () =>
      console.log(
        `Backend running on http://localhost:${PORT} in ${NODE_ENV} mode.`
      )
    );
  } catch (error: any) {
    throw new Error(error);
  }
};

startServer();
