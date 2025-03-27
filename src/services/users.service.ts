import User from "../models/user";
import mongoose from "mongoose";
import { SignUpDataScehema, UpdateUserDataScehema } from "../schemas/auth";
import AuthCode from "../models/AuthCode";
import { User as UserType } from "../interfaces/express";
import ProjectReport from "../models/projectReport";

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
   * Verify the user by email.
   * @param email - User email.
   * @returns user document.
   */
  verifyUserByEmail = async (email: string) => {
    const user = await User.findOneAndUpdate({ email }, { isVerified: true });
    return user;
  };

  /**
   * Update Password of the user by uid.
   * @param uid - User unique id.
   * @param password - User new password.
   * @returns user document.
   */
  updatePassword = async (uid: UserType["uid"], password: string) => {
    let user = await User.findByIdAndUpdate(uid, { password });
    if (user) user.password = "";
    return user;
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

  // Get users/programs based on type (isUser flag) with pagination.
  getUsers = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;

    // Fetch users with pagination and report count in one go
    const users = await User.aggregate([
      {
        $lookup: {
          from: "projectreport",
          localField: "_id",
          foreignField: "userId",
          as: "reports",
          pipeline: [
            { $match: { isDeleted: false } },
            { $match: { isDraft: false } },
            { $count: "reportCount" },
          ],
        },
      },
      {
        $addFields: {
          reportCount: {
            $ifNull: [{ $arrayElemAt: ["$reports.reportCount", 0] }, 0],
          },
        },
      },
      { $project: { password: 0 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const totalCount = await User.countDocuments();

    return {
      users,
      pagination: {
        totalCount,
        currentPage: page,
        currentSize: limit,
      },
    };
  };

  // Get published users with a count of submitted reports.
  getTopUsers = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const users = await User.find({
      isDeleted: false,
    })
      .skip(skip)
      .limit(limit)
      .exec();

    // For each user, count the number of submitted reports.
    const usersWithReportCount = await Promise.all(
      users.map(async (user) => {
        const reportCount = await ProjectReport.countDocuments({
          userId: user._id,
          isDraft: false,
        }).exec();
        return { ...user.toObject(), reportCount };
      }),
    );

    return usersWithReportCount;
  };

  // Get a single user by its id including its sections.
  getUserDetailsById = async (userId: string) => {
    const user = await User.findById(userId).lean().exec();
    if (!user) return null;

    return { ...user };
  };

  // Update an existing user.
  updateUser = async (userId: string, data: UpdateUserDataScehema) => {
    return await User.findByIdAndUpdate(userId, data, {
      new: true,
    }).exec();
  };

  // Delete a user.
  deleteUser = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) return null;
    return await user.softDelete();
  };

  // Delete a user.
  restoreUser = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) return null;
    return await user.restoreUser();
  };
}

export default UserService;
