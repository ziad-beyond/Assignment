import { Request, Response, NextFunction } from "express";
import { prisma } from "../config";
import bcrypt from "bcrypt";
import badRequest from "../errors/badRequest";
import jwt from "jsonwebtoken";
import AuthenticationError from "../errors/AuthenticationError";
import {serialize} from 'cookie';

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}
const jwtSecret: string = process.env.JWT_SECRET;


export const SignUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password,role } = req.body;
        const existingUser = await prisma.user.findUnique({ 
            where: { email }, });
             if (existingUser) {
                 throw new badRequest("Email is already in use");
             }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role ? role : 'employee',
            },
        });

        if (user) {
            res.status(201).json({ message: "User created successfully, please login" })
        } else {
            throw new Error("Couldn't register user")
        }
    } catch (error: any) {
        next(error)
    }
}

export const SignIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new AuthenticationError("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new AuthenticationError("Invalid email or password");
        }

        const token = jwt.sign({ userId: user.id, role: user.role  }, jwtSecret, { expiresIn: "1h" });

        res.setHeader('Set-Cookie', serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development', 
            maxAge: 60 * 60, // 1 hour
            sameSite: 'strict',
            path: '/'
        }));

        res.json({ token, email: user.email, name: user.name,role: user.role  });   
         } catch (error) {
        next(error);
    }
};

