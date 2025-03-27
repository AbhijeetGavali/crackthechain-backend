import { Router } from "express";
import { bodySchemaValidator } from "../middlewares/schema.validator";
import ReportController from "../controllers/report.controller";
import { createReportData, updateReportData } from "../schemas/report";
import { verifyJWT } from "../helpers/token";

const reportRouter = Router({ mergeParams: true });
const reportController = new ReportController();

/**
 * POST /api/reports
 * Create a new project report.
 */
reportRouter.post(
  "/",
  verifyJWT,
  bodySchemaValidator(createReportData),
  reportController.createReport,
);

/**
 * PUT /api/reports/:id
 * Update an existing project report.
 */
reportRouter.put(
  "/:id",
  bodySchemaValidator(updateReportData),
  reportController.updateReport,
);

/**
 * DELETE /api/reports/:id
 * Delete a project report.
 */
reportRouter.delete("/:id", reportController.deleteReport);

/**
 * POST /api/reports/:id/restore
 * Restore a project report.
 */
reportRouter.post("/:id/restore", reportController.restoreReport);

/**
 * POST /api/reports/:id/publish
 * Publish a project report.
 */
reportRouter.post("/:id/publish", reportController.publishReport);

/**
 * POST /api/reports/:id/unpublish
 * Unpublish a project report.
 */
reportRouter.post("/:id/unpublish", reportController.unpublishReport);

/**
 * GET /api/reports/project/:projectId/published?page=&limit=
 * Get list of published project reports for a specific project.
 * Response should include project details and a list of reports with user details.
 */
reportRouter.get(
  "/project/:projectId/published",
  reportController.getPublishedReportsByProject,
);

/**
 * GET /api/reports/user/:userId?page=&limit=
 * Get list of all project reports submitted by a user.
 * Response should include user details and the associated project details.
 */
reportRouter.get("/user", verifyJWT, reportController.getReportsByUser);

/**
 * GET /api/reports/:id
 * Get detailed information about a specific report.
 * Response should include full report details, along with project and user details.
 */
reportRouter.get("/:id", reportController.getReportDetails);

export default reportRouter;
