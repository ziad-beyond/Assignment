"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseError_1 = __importDefault(require("./baseError"));
class badRequest extends baseError_1.default {
    constructor(message = "Bad request, review validation errors", stack) {
        super(400, "BadRequest", message, stack || {});
    }
}
exports.default = badRequest;
