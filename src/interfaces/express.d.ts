import { Request } from "express";
import { Types } from "mongoose";

export interface User {
  email: string;
  claim: string;
  uid: Types.ObjectId;
}

export interface JWTRequest extends Request {
  jwt: User;
}
