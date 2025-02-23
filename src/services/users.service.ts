import User from "../models/user";
import mongoose from "mongoose";
import { SignUpDataScehema } from "../schemas/auth";
import AuthCode from "../models/AuthCode";

class UserService {
  /**
   * Fetches a auth code validity.
   * @param authCode - User's auth code.
   * @returns AuthCode document or null if not found.
   */
  getAuthCodeValidity = async (authCode: string) => {
    return await AuthCode.findOne({ authCode }).exec();
  };

  /**
   * Fetches a user by email.
   * @param email - User's email.
   * @returns User document or null if not found.
   */
  getUserByEmail = async (email: string) => {
    return await User.findOne({ email }).exec();
  };

  /**
   * Creates a new user.
   * @param data - User signup data.
   * @returns Created user document.
   */
  createUser = async (data: SignUpDataScehema) => {
    const user = new User(data);
    return await user.save();
  };

  /**
   * Fetches a user by their unique ID.
   * @param userId - User's unique MongoDB ObjectId.
   * @returns User document or null if not found.
   */
  getUserById = async (userId: string) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) return null;

    const data = await User.findById(userId).exec();

    if (data) {
      const userObject = data.toObject();
      delete userObject.password;
      return userObject;
    }

    return null;
  };
}

export default UserService;
