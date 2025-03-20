import { Document, Schema, Types, model } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  profilePhoto: string;
  authCode: string;
  loginType: string;
  isVerified: boolean;
}

export const UserSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePhoto: { type: String },
    authCode: { type: String },
    loginType: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const User = model<IUser>("User", UserSchema);

export default User;
