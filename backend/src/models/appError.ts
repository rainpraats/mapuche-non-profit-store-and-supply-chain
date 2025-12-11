export default class AppError extends Error {
  public statusCode: number;
  public status: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    switch (statusCode) {
      case 400:
        this.status =
          'Bad Request, missing typically due to malformed request syntax, invalid request message framing, or deceptive request routing';
        break;
      case 401:
        this.status = 'Unauthorized';
        break;
      case 403:
        this.status = 'Forbidden. Insufficient permissions to access the given resource';
        break;
      case 404:
        this.status = 'Not found. The server cannot find the requested resource';
        break;
      case 405:
        this.status = 'Method not allowed';
        break;
      case 413:
        this.status = 'The request is larger than what the server allows';
        break;
      case 415:
        this.status = 'The media type is not supported';
        break;
      case 429:
        this.status = 'Too many requests';
        break;
      default:
        if (statusCode.toString().startsWith('5')) {
          this.status = 'Internal Server Error';
        } else {
          this.status = 'Request failed due to an unknown error';
        }
    }

    Error.captureStackTrace(this, this.constructor);
  }
}
