"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseError_1 = __importDefault(require("./baseError"));
class AuthenticationError extends baseError_1.default {
    constructor(message = "Authentication error", stack) {
        super(401, "Authentication error", message, stack || {});
    }
}
exports.default = AuthenticationError;
