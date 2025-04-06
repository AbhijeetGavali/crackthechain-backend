import { Request, Response } from "express";
import { buildResponse } from "../common/utils";
import { errorHandler } from "../common/errors";
import ProjectService from "../services/project.service";
import { JWTRequest } from "../interfaces/express";

class ProjectController {
  private _projectService = new ProjectService();

  // GET /api/projects?type=project|program&page=&limit=
  getProjects = async (req: Request, res: Response) => {
    try {
      // isProject flag: if type is "program", set isProject to false.
      const isProject = req.query.type === "program" ? false : true;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const results = await this._projectService.getProjects(
        isProject,
        page,
        limit,
      );
      res
        .status(200)
        .send(buildResponse(results, "Projects fetched successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  // GET /api/projects/published?type=project|program&page=&limit=
  getPublishedProjects = async (req: Request, res: Response) => {
    try {
      const isProject = req.query.type === "program" ? false : true;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const projects = await this._projectService.getPublishedProjects(
        isProject,
        page,
        limit,
      );
      res
        .status(200)
        .send(
          buildResponse(projects, "Published projects fetched successfully"),
        );
    } catch (error) {
      errorHandler(res, error);
    }
  };

  // GET /api/projects/published/dropdown
  getPublishedProjectsForDropdown = async (req: Request, res: Response) => {
    try {
      const isProject = req.query.type === "program" ? false : true;

      const projectsWithReportCount =
        await this._projectService.getPublishedProjectsForDropdown(isProject);
      res
        .status(200)
        .send(
          buildResponse(
            { projects: projectsWithReportCount },
            "Published projects fetched successfully",
          ),
        );
    } catch (error) {
      errorHandler(res, error);
    }
  };

  // GET /api/projects/:id
  getProjectDetails = async (req: Request, res: Response) => {
    try {
      const projectId = req.params.id;
      const projectDetails =
        await this._projectService.getProjectById(projectId);
      if (!projectDetails) {
        res.status(404).send(buildResponse(null, "Project not found"));
        return;
      }
      // Assume that project details include sections if populated by service layer or separate query
      // For now, we return the project details only.
      res
        .status(200)
        .send(
          buildResponse(projectDetails, "Project details fetched successfully"),
        );
    } catch (error) {
      errorHandler(res, error);
    }
  };

  // POST /api/projects
  createProject = async (req: JWTRequest, res: Response) => {
    try {
      const data = req.body;
      if (req.jwt.claim == "company") data["companyId"] = req.jwt.uid;
      const newProject = await this._projectService.createProject(data);
      res
        .status(201)
        .send(buildResponse(newProject, "Project created successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  // PUT /api/projects/:id
  updateProject = async (req: Request, res: Response) => {
    try {
      const projectId = req.params.id;
      const data = req.body;
      const updatedProject = await this._projectService.updateProject(
        projectId,
        data,
      );
      if (!updatedProject) {
        res.status(404).send(buildResponse(null, "Project not found"));
        return;
      }
      res
        .status(200)
        .send(buildResponse(updatedProject, "Project updated successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  // DELETE /api/projects/:id
  deleteProject = async (req: Request, res: Response) => {
    try {
      const projectId = req.params.id;
      const deletedProject =
        await this._projectService.deleteProject(projectId);
      if (!deletedProject) {
        res.status(404).send(buildResponse(null, "Project not found"));
        return;
      }
      res
        .status(200)
        .send(buildResponse(deletedProject, "Project deleted successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  // POST /api/projects/:id/restore
  restoreProject = async (req: Request, res: Response) => {
    try {
      const projectId = req.params.id;
      const restoredProject =
        await this._projectService.restoreProject(projectId);
      if (!restoredProject) {
        res.status(404).send(buildResponse(null, "Project not found"));
        return;
      }
      res
        .status(200)
        .send(buildResponse(restoredProject, "Project restored successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  // POST /api/projects/:id/publish
  publishProject = async (req: Request, res: Response) => {
    try {
      const projectId = req.params.id;
      const project = await this._projectService.publishProject(projectId);
      if (!project) {
        res.status(404).send(buildResponse(null, "Project not found"));
        return;
      }
      res
        .status(200)
        .send(buildResponse(project, "Project published successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  // POST /api/projects/:id/unpublish
  unpublishProject = async (req: Request, res: Response) => {
    try {
      const projectId = req.params.id;
      const project = await this._projectService.unpublishProject(projectId);
      if (!project) {
        res.status(404).send(buildResponse(null, "Project not found"));
        return;
      }
      res
        .status(200)
        .send(buildResponse(project, "Project unpublished successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };
}

export default ProjectController;
