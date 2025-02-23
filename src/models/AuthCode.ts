import { Document, Schema, Types, model } from "mongoose";

export interface IAuthCode extends Document {
  _id: Types.ObjectId;
  authCode: string;
}

export const AuthCodeSchema = new Schema(
  {
    authCode: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

const AuthCode = model<IAuthCode>("AuthCode", AuthCodeSchema);

export default AuthCode;
