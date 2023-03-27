export class HttpError extends Error {
  public readonly status: number;

  constructor(status: number | string, message: string) {
    super(message);
    this.status = +status || 500;
  }
}
