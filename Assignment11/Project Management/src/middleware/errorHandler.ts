import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  status?: number;
  message: string;
  stack?: string;
}

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.error('Error occurred:', err);

  err.status = err.status || 500;
  res.status(err.status).json({
    status: err.status,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === 'development' ? err.stack : {}, 
  });
};

export default errorHandler;
