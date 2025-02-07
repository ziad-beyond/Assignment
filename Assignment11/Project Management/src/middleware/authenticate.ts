import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}
const jwtSecret: string = process.env.JWT_SECRET;

export interface AuthenticatedRequest extends Request {
    user?: { userId: string };
}
export const authenticate =(roles: string[])=> (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const token = req.header("Authorization")?.replace("Bearer ", "").trim();
    if (!token) {
        res.status(401).json({ error: "Access denied. No token provided." });
        return;
    }
    try {
        const decoded = jwt.verify(token, jwtSecret) as { userId: string ,role: string};
        req.user = decoded;
        if (!roles.includes(decoded.role)) {
             res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
};