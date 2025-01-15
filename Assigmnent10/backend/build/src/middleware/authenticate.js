"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}
const jwtSecret = process.env.JWT_SECRET;
const authenticate = (req, res, next) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "").trim();
    if (!token) {
        res.status(401).json({ error: "Access denied. No token provided." });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
};
exports.authenticate = authenticate;
