"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.config = void 0;
const prisma_1 = __importDefault(require("./prisma"));
exports.prisma = prisma_1.default;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    port: process.env.PORT || 8000,
    environment: process.env.NODE_ENV || 'development',
};
exports.config = config;
