export default class baseError {
    status: number = 500
    type: string = "InternalServerError"
    message: string = 'Internal server error: please contact admin'
    stack: Object = {}

    constructor(status: number, type: string, message: string, stack: Object) {
        this.status = status;
        this.type = type;
        this.message = message;
        this.stack = stack;
    }
}