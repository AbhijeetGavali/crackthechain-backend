import { Document, Schema, Types, model } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  profilePhoto: string;
  authCode: string;
  loginType: string;
  isVerified: boolean;
  about: string;
  socialLink: string[];
  isDeleted: boolean;
  deletedAt?: Date;
  softDelete(): Promise<void>;
  restoreUser(): Promise<void>;
}

export const UserSchema = new Schema(
  {
    companyName: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePhoto: { type: String },
    authCode: { type: String },
    loginType: { type: String, enum: ["researcher", "company", "admin"] },
    about: { type: Array<String>, default: [] },
    socialLink: { type: Array<String>, default: [] },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

// Add a method for soft delete
UserSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return await this.save();
};

// Add a method for restore User
UserSchema.methods.restoreUser = async function () {
  this.isDeleted = false;
  this.isVerified = false;
  this.deletedAt = new Date();
  return await this.save();
};

const User = model<IUser>("User", UserSchema);

export default User;
