import baseError from "./baseError"
export default class NotFound extends baseError {
    constructor(message: string = "Not Found", stack?: Object) {
        super(404, 'Not Found error', message, stack || {})
    }
}