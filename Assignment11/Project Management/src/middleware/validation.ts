import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodSchema, z } from "zod";
import  badRequest  from "../errors/badRequest";
const validateBody = (schema: ZodSchema): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return next(new badRequest("Validation failed", { errors: error.errors }));
            }
            next(error);
        }
    };
};


const validateQuery = (schema: ZodSchema): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.query);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return next(new badRequest("Validation failed", { errors: error.errors }));
            }
            next(error);
        }
    };
};


const validateParams = (schema: ZodSchema): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.params);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return next(new badRequest("Validation failed", { errors: error.errors }));
            }
            next(error);
        }
    };
};


export { validateBody, validateQuery, validateParams };