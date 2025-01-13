import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { register } from "../schemas/auth"
import { ZodError } from "zod";
import badRequest from "../errors/badRequest"
import AuthenticationError from "../errors/AuthenticationError ";
import { error } from "console";
import {serialize} from 'cookie';


const saltRounds = 10

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}
const jwtSecret: string = process.env.JWT_SECRET;

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await prisma.user.findUnique({ 
            where: { email }, });
             if (existingUser) {
                 throw new badRequest("Email is already in use");
             }
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
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
export const signin = async (req: Request, res: Response, next: NextFunction) => {
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

        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "1h" });

        res.setHeader('Set-Cookie', serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development', 
            maxAge: 60 * 60, // 1 hour
            sameSite: 'strict',
            path: '/'
        }));

        res.json({ token, email: user.email, name: user.name });   
         } catch (error) {
        next(error);
    }
};



export const logout = async (req:Request, res:Response, next:NextFunction) => {
  try {
    res.setHeader('Set-Cookie', serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: -1, 
      sameSite: 'strict',
      path: '/'
    }));

    res.json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};
