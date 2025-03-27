import { Router } from "express";
import { bodySchemaValidator } from "../middlewares/schema.validator";
import ProjectController from "../controllers/project.controller";
import { createProjectData, updateProjectData } from "../schemas/project";

const projectRouter = Router({ mergeParams: true });
const projectController = new ProjectController();

/**
 * GET /api/projects?type=project|program&page=&limit=
 * Get all projects/programs. Accepts a query param "type" (project or program) along with pagination.
 */
projectRouter.get("/", projectController.getProjects);

/**
 * GET /api/projects/published?type=project|program&page=&limit=
 * Get published projects/programs along with a count of submitted reports.
 */
projectRouter.get("/published", projectController.getPublishedProjects);

/**
 * GET /api/projects/published/dropdown
 * Get published projects/programs along with a count of submitted reports.
 */
projectRouter.get("/published/dropdown", projectController.getPublishedProjectsForDropdown);

/**
 * GET /api/projects/:id
 * Get project/program details including its sections.
 */
projectRouter.get("/:id", projectController.getProjectDetails);

/**
 * POST /api/projects
 * Create a new project/program.
 */
projectRouter.post(
  "/",
  bodySchemaValidator(createProjectData),
  projectController.createProject,
);

/**
 * PUT /api/projects/:id
 * Update an existing project/program.
 */
projectRouter.patch(
  "/:id",
  bodySchemaValidator(updateProjectData),
  projectController.updateProject,
);

/**
 * DELETE /api/projects/:id
 * Delete a project/program.
 */
projectRouter.delete("/:id", projectController.deleteProject);

/**
 * POST /api/projects/:id/restore
 * Restore a project/program.
 */
projectRouter.post("/:id/restore", projectController.restoreProject);

/**
 * POST /api/projects/:id/publish
 * Publish a project/program.
 */
projectRouter.post("/:id/publish", projectController.publishProject);

/**
 * POST /api/projects/:id/unpublish
 * Unpublish a project/program.
 */
projectRouter.post("/:id/unpublish", projectController.unpublishProject);

export default projectRouter;
