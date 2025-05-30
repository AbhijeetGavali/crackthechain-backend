import ProjectReport from "../models/projectReport";
import Project from "../models/project";
import User from "../models/user";
import {
  CreateReportSchema,
  UpdateReportByCompanySchema,
  UpdateReportSchema,
} from "../schemas/report";
import { Types } from "mongoose";

class ReportService {
  // Create a new project report.
  createReport = async (data: CreateReportSchema) => {
    const report = new ProjectReport(data);
    return await report.save();
  };

  // Update an existing project report.
  updateReport = async (
    reportId: string,
    data: UpdateReportSchema | UpdateReportByCompanySchema,
  ) => {
    return await ProjectReport.findByIdAndUpdate(reportId, data, {
      new: true,
    }).exec();
  };

  // Delete a project report.
  deleteReport = async (reportId: string) => {
    const report = await ProjectReport.findById(reportId);
    if (!report) return null;

    return await report.softDelete();
  };

  // restore a project report.
  restoreReport = async (reportId: string) => {
    const report = await ProjectReport.findById(reportId);
    if (!report) return null;

    return await report.restoreReport();
  };

  // Publish a project report (mark as not draft).
  publishReport = async (reportId: string) => {
    return await ProjectReport.findByIdAndUpdate(
      reportId,
      { isDraft: false },
      { new: true },
    ).exec();
  };

  // Unpublish a project report (mark as draft).
  unpublishReport = async (reportId: string) => {
    return await ProjectReport.findByIdAndUpdate(
      reportId,
      { isDraft: true },
      { new: true },
    ).exec();
  };

  // Get a list of published reports for a specific project with pagination.
  // Returns both project details and its published reports.
  getPublishedReportsByProject = async (
    projectId: string,
    page: number,
    limit: number,
  ) => {
    const skip = (page - 1) * limit;
    const reports = await ProjectReport.find({
      projectId,
      isDraft: false,
      isDeleted: false,
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate({
        path: "userId",
        select: "firstName lastName",
      })
      .exec();

    const project = await Project.findById(projectId).exec();
    const totalCount = await ProjectReport.countDocuments({
      projectId,
      isDraft: false,
      isDeleted: false,
    });

    return {
      project,
      reports,
      pagination: {
        totalCount,
        currentPage: page,
        currentSize: limit,
      },
    };
  };

  // Get all reports submitted by a specific user with pagination.
  getReportsByUser = async (
    userId: Types.ObjectId,
    page: number,
    limit: number,
  ) => {
    const skip = (page - 1) * limit;
    const reports = await ProjectReport.find({ userId })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "projectId",
        select: "projectName",
      })
      .sort({ createdAt: -1 })
      .exec();
    const user = await User.findById(userId).exec();
    const totalCount = await ProjectReport.countDocuments({ userId });
    return {
      user,
      reports: reports,
      pagination: {
        totalCount,
        currentPage: page,
        currentSize: limit,
      },
    };
  };

  // Get detailed information for a specific report.
  getReportDetails = async (reportId: string) => {
    return await ProjectReport.findById(reportId).exec();
  };
}

export default ReportService;
