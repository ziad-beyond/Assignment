"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class baseError {
    constructor(status, type, message, stack) {
        this.status = 500;
        this.type = "InternalServerError";
        this.message = 'Internal server error: please contact admin';
        this.stack = {};
        this.status = status;
        this.type = type;
        this.message = message;
        this.stack = stack;
    }
}
exports.default = baseError;
