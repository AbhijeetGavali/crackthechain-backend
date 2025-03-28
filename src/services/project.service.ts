import Project from "../models/project";
import ProjectSection from "../models/projectSection";
import ProjectReport from "../models/projectReport";
import {
  CreateProjectDataScehema,
  UpdateProjectDataScehema,
} from "../schemas/project";

class ProjectService {
  // Get projects/programs based on type (isProject flag) with pagination.
  getProjects = async (isProject: boolean, page: number, limit: number) => {
    const skip = (page - 1) * limit;

    // Fetch projects with pagination and report count in one go
    const projects = await Project.aggregate([
      { $match: { isProject } },
      {
        $lookup: {
          from: "projectreports",
          localField: "_id",
          foreignField: "projectId",
          as: "reports",
          pipeline: [
            { $match: { isDeleted: false } },
            { $match: { isDraft: false } },
            { $count: "reportCount" },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "companyId",
          foreignField: "_id",
          as: "companyId",
          pipeline: [
            { $match: { isDeleted: false } },
            {
              $project: {
                companyName: 1,
                email: 1,
                profilePhoto: 1,
                about: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          reportCount: {
            $ifNull: [{ $arrayElemAt: ["$reports.reportCount", 0] }, 0],
          },
          companyId: {
            $arrayElemAt: ["$companyId", 0],
          },
        },
      },
      { $project: { reports: 0 } },
      { $skip: skip },
      { $limit: limit },
      { $sort: { createdAt: -1 } },
    ]);

    const totalCount = await Project.countDocuments({ isProject });

    return {
      projects,
      pagination: {
        totalCount,
        currentPage: page,
        currentSize: limit,
      },
    };
  };

  // Get published projects/programs with a count of submitted reports.
  getPublishedProjects = async (
    isProject: boolean,
    page: number,
    limit: number,
  ) => {
    const skip = (page - 1) * limit;
    const projects = await Project.find({
      isProject,
      isPublished: true,
      isDeleted: false,
    })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "companyId",
        select: "companyName email profilePhoto about",
      })
      .sort({ createdAt: -1 })
      .exec();

    const totalCount = await Project.countDocuments({
      isProject,
      isPublished: true,
      isDeleted: false,
    });

    return {
      projects,
      pagination: {
        totalCount,
        currentPage: page,
        currentSize: limit,
      },
    };
  };

  // Get published projects/programs with a count of submitted reports.
  getPublishedProjectsForDropdown = async (isProject: boolean) => {
    const projects = await Project.find(
      {
        isProject,
        isPublished: true,
        isDeleted: false,
      },
      "_id projectName",
    )
      .sort({ projectName: -1 })
      .exec();

    return projects;
  };

  // Get a single project by its id including its sections.
  getProjectById = async (projectId: string) => {
    const project = await Project.findById(projectId)
      .populate({
        path: "companyId",
        select: "companyName email profilePhoto about",
      })
      .lean()
      .exec();
    if (!project) return null;

    const sections = await ProjectSection.find({ projectId: project._id })
      .sort({ rank: 1 })
      .lean()
      .exec();

    return { project, sections };
  };

  // Create a new project/program.
  createProject = async (data: CreateProjectDataScehema) => {
    const project = new Project(data);
    return await project.save();
  };

  // Update an existing project/program.
  updateProject = async (projectId: string, data: UpdateProjectDataScehema) => {
    return await Project.findByIdAndUpdate(projectId, data, {
      new: true,
    }).exec();
  };

  // Delete a project/program.
  deleteProject = async (projectId: string) => {
    const project = await Project.findById(projectId);
    if (!project) return null;
    return await project.softDelete();
  };

  // Delete a project/program.
  restoreProject = async (projectId: string) => {
    const project = await Project.findById(projectId);
    if (!project) return null;
    return await project.restoreProject();
  };

  // Publish a project/program.
  publishProject = async (projectId: string) => {
    return await Project.findByIdAndUpdate(
      projectId,
      { isPublished: true },
      { new: true },
    ).exec();
  };

  // Unpublish a project/program.
  unpublishProject = async (projectId: string) => {
    return await Project.findByIdAndUpdate(
      projectId,
      { isPublished: false },
      { new: true },
    ).exec();
  };
}

export default ProjectService;
