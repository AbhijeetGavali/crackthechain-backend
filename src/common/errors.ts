import { Response } from "express";
import logger from "./logger";
import { buildResponse } from "./utils";

export class ForbiddenError extends Error {
  constructor(public message: string) {
    super(message);
  }
}
export class TokenExpireError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = "TokenExpireError";
  }
}

export class ValidationFailedError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = "ValidationFailedError";
  }
}

export class ResourceNotFoundError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = "ResourceNotFoundError";
  }
}

export class MongoError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = "MongoError";
  }
}

export class S3Error extends Error {
  constructor(public message: string) {
    super(message);
    this.name = "Failed to perform AWS S3 operations";
  }
}

export const errorHandler = (res: Response, error: Error) => {
  logger.error(error);

  if (
    error instanceof ValidationFailedError ||
    error instanceof TokenExpireError ||
    error instanceof ResourceNotFoundError ||
    error instanceof ForbiddenError ||
    error instanceof MongoError ||
    error instanceof S3Error
  ) {
    return res.status(400).send(buildResponse("", error.message, error));
  }

  return res.status(500).send(buildResponse("", "Server Error", error));
};
