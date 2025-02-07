import baseError from "./baseError";
export default class badRequest extends baseError {
  constructor(
    message: string = "Bad request, review validation errors",
    stack?: Object
  ) {
    super(400, "BadRequest", message, stack || {});
  }
}