import baseError from "./baseError";
export default class AuthenticationError extends baseError {
  constructor(message: string = "Authentication error", stack?: Object) {
    super(401, "Authentication error", message, stack || {});
  }
}
