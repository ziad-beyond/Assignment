import { Request, Response, NextFunction } from "express";
interface Error {
    statusCode?: number;
    status?: string;
    message?: string;
    stack?: Object;
}

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message || "Internal Server Error",
        stack: err.stack,
    });
}
export default errorHandler;
