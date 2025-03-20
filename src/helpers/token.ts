import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { NextFunction, RequestHandler, Response } from "express";
import {
  TokenExpireError,
  ValidationFailedError,
  errorHandler,
} from "../common/errors";
import { JWTRequest, User } from "../interfaces/express";

dotenv.config();

export const getToken: (
  user: User,
  expiresIn: number,
) => Promise<string> = async (user: User, expiresIn = 3) => {
  const options: jwt.SignOptions = { expiresIn: `${expiresIn}D` };
  const token = jwt.sign(
    { ...user },
    process.env.JWT_SECRET ?? "SECRET",
    options,
  );
  // console.log(token);

  return token;
};

export const verifyJWT: RequestHandler = async (
  req: JWTRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token = req.get("authorization");
    if (token) {
      token = token.split(" ")[1];

      jwt.verify(
        token,
        process.env.JWT_SECRET ?? "SECRET",
        async (err, result: jwt.JwtPayload & User) => {
          try {
            if (err) {
              throw new TokenExpireError("Token is expired");
            } else {
              req.jwt = {
                email: result?.email ?? "",
                uid: result?.uid ?? "",
                claim: result?.claim ?? "",
              };
              return next();
            }
          } catch (error) {
            errorHandler(res, error);
          }
        },
      );
    } else {
      throw new ValidationFailedError("Provide Autherization token");
    }
  } catch (error) {
    errorHandler(res, error);
  }
};

export const tokenFromQuery: RequestHandler = async (req, _res, next) => {
  if (!req.headers.authorization && req.query.token) {
    req.headers.authorization = `Bearer ${req.query.token}`;
  }
  next();
};
