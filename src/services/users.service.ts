import User from "../models/user";
import mongoose from "mongoose";
import { SignUpDataScehema, UpdateUserDataScehema } from "../schemas/auth";
import AuthCode from "../models/AuthCode";
import { User as UserType } from "../interfaces/express";
import ProjectReport from "../models/projectReport";
import Project from "../models/project";

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
          from: "projectreports",
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
      { $project: { password: 0, reports: 0 } },
      { $skip: skip },
      { $limit: limit },
      { $sort: { createdAt: -1 } },
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

  // Get users/programs based on type (isUser flag) with pagination.
  getAdminDashboardStats = async () => {
    const projectStats = await Project.aggregate([
      {
        $group: {
          _id: {
            isProject: "$isProject",
            isPublish: "$isPublished",
          },
          count: { $sum: 1 },
        },
      },
      {
        $addFields: {
          type: {
            $cond: [{ $eq: ["$_id.isProject", true] }, "Project", "Program"],
          },
          status: {
            $cond: [
              { $eq: ["$_id.isPublish", true] },
              "Published",
              "Unpublished",
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          type: 1,
          status: 1,
          count: 1,
        },
      },
    ]);

    const userStats = await User.aggregate([
      {
        $match: {
          loginType: { $ne: "admin" },
        },
      },
      {
        $group: {
          _id: "$loginType",
          count: { $sum: 1 },
        },
      },
    ]);

    const reportStats = await ProjectReport.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $facet: {
          totalPublishedReports: [
            {
              $match: { isDraft: false },
            },
            {
              $count: "count",
            },
          ],
          settledReports: [
            {
              $match: { status: "accepted" },
            },
            {
              $count: "count",
            },
          ],
        },
      },
      {
        $addFields: {
          totalPublishedReports: {
            $arrayElemAt: ["$totalPublishedReports.count", 0],
          },
          settledReports: { $arrayElemAt: ["$settledReports.count", 0] },
        },
      },
    ]);

    return {
      projectStats: projectStats.reduce(
        (prv, crt) => ({
          ...prv,
          [crt.type]: { ...prv[crt.type], [crt.status]: crt.count },
        }),
        {},
      ),
      userStats: userStats.reduce(
        (prv, crt) => ({ ...prv, [crt._id]: crt.count }),
        {},
      ),
      reportStats: reportStats[0],
    };
  };

  // Get published users with a count of submitted reports.
  getTopUsers = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const users = await User.aggregate([
      {
        $match: {
          isDeleted: false,
          loginType: "researcher",
        },
      },
      {
        $lookup: {
          from: "projectreports",
          localField: "_id",
          foreignField: "userId",
          as: "reports",
        },
      },
      {
        $addFields: {
          reportsSubmittedCount: {
            $size: {
              $filter: {
                input: "$reports",
                as: "report",
                cond: {
                  $and: [
                    { $eq: ["$$report.isDraft", false] },
                    { $eq: ["$$report.isDeleted", false] },
                  ],
                },
              },
            },
          },
          bountiesEarned: {
            $size: {
              $filter: {
                input: "$reports",
                as: "report",
                cond: {
                  $and: [
                    { $eq: ["$$report.isAccepted", true] },
                    { $eq: ["$$report.isDeleted", false] },
                  ],
                },
              },
            },
          },
          projectsContributed: {
            $size: {
              $setUnion: {
                $map: {
                  input: {
                    $filter: {
                      input: "$reports",
                      as: "report",
                      cond: {
                        $and: [
                          { $eq: ["$$report.isAccepted", true] },
                          { $eq: ["$$report.isDeleted", false] },
                        ],
                      },
                    },
                  },
                  as: "acceptedReport",
                  in: "$$acceptedReport.projectId",
                },
              },
            },
          },
          points: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$reports",
                    as: "report",
                    cond: {
                      $and: [
                        { $eq: ["$$report.isAccepted", true] },
                        { $eq: ["$$report.isDeleted", false] },
                      ],
                    },
                  },
                },
                as: "acceptedReport",
                in: "$$acceptedReport.points",
              },
            },
          },
        },
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          profilePhoto: 1,
          about: 1,
          bountiesEarned: 1,
          reportsSubmittedCount: 1,
          projectsContributed: 1,
          points: 1,
        },
      },
      { $sort: { bountiesEarned: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    return users.map((user) => ({
      _id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      profilePhoto: user.profilePhoto,
      about: user.about,
      bountiesEarned: user.bountiesEarned || 0,
      reportsSubmittedCount: user.reportsSubmittedCount || 0,
      projectsContributed: user.projectsContributed || 0,
      points: user.points || 0,
    }));
  };

  // Get dropdown to show users in option
  getUsersDropdown = async (loginType: string) => {
    const users = await User.find(
      {
        loginType,
      },
      "_id companyName email firstName lastName",
    )
      .sort({ createdAt: -1 })
      .exec();

    return users;
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
