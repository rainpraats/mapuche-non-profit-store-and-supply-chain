import dotenv from 'dotenv';
dotenv.config();

const assertVariableType = (dotenvVariable: string | undefined): string => {
  if (!dotenvVariable || dotenvVariable === 'undefined') {
    throw new Error(
      'variable is not defined. Make sure it exists in .env file.'
    );
  }
  return dotenvVariable;
};
export const JWT_SECRET = assertVariableType(process.env.JWT_SECRET);

export const JWT_EXPIRES = assertVariableType(process.env.JWT_EXPIRES);

export const MONGO_URI = assertVariableType(process.env.MONGO_URI);

export const MONGO_DB_NAME = assertVariableType(process.env.MONGO_DB_NAME);

export const PORT = assertVariableType(process.env.PORT);

export const NODE_ENV = assertVariableType(process.env.NODE_ENV);

export const RPC_URL = assertVariableType(process.env.RPC_URL);
