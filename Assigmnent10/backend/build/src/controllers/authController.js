"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.signin = exports.signup = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const badRequest_1 = __importDefault(require("../errors/badRequest"));
const AuthenticationError_1 = __importDefault(require("../errors/AuthenticationError "));
const cookie_1 = require("cookie");
const saltRounds = 10;
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}
const jwtSecret = process.env.JWT_SECRET;
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const existingUser = yield prisma_1.default.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new badRequest_1.default("Email is already in use");
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        const user = yield prisma_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        if (user) {
            res.status(201).json({ message: "User created successfully, please login" });
        }
        else {
            throw new Error("Couldn't register user");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.signup = signup;
const signin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new AuthenticationError_1.default("Invalid email or password");
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new AuthenticationError_1.default("Invalid email or password");
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, jwtSecret, { expiresIn: "1h" });
        res.setHeader('Set-Cookie', (0, cookie_1.serialize)('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 60 * 60, // 1 hour
            sameSite: 'strict',
            path: '/'
        }));
        res.json({ token, email: user.email, name: user.name });
    }
    catch (error) {
        next(error);
    }
});
exports.signin = signin;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.setHeader('Set-Cookie', (0, cookie_1.serialize)('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: -1,
            sameSite: 'strict',
            path: '/'
        }));
        res.json({ message: 'Logout successful' });
    }
    catch (error) {
        next(error);
    }
});
exports.logout = logout;
