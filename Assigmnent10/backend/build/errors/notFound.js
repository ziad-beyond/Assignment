"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseError_1 = __importDefault(require("./baseError"));
class NotFound extends baseError_1.default {
    constructor(message = "Not Found", stack) {
        super(404, 'Not Found error', message, stack || {});
    }
}
exports.default = NotFound;
