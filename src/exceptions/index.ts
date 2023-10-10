export class Exception extends Error {
  status: number;
  errors: string[]
  constructor(status: number, message: string, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static BadRequest(message: string, errors = []) {
    return new Exception(400, message, errors);
  }

  static Forbidden(message: string) {
    return new Exception(403, message);
  }

  static NotFound(message: string) {
    return new Exception(404, message);
  }

  static Conflict(message: string = 'Conflict') {
    return new Exception(409, message);
  }

  static InternalServerError(message: string) {
    return new Exception(500, message);
  }
}