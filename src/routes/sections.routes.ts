import { Router } from "express";
import { bodySchemaValidator } from "../middlewares/schema.validator";
import SectionController from "../controllers/section.controller";
import {
  createSectionData,
  updateSectionData,
  changeRankData,
} from "../schemas/section";

const sectionRouter = Router({ mergeParams: true });

const sectionController = new SectionController();

/**
 * POST /api/projects/:projectId/sections
 * Create a new section for a project/program.
 * If "isAsset" is set to true, the controller should ensure no other section for the same project is marked as asset.
 */
sectionRouter.post(
  "/:projectId/sections",
  bodySchemaValidator(createSectionData),
  sectionController.createSection,
);

/**
 * PUT /api/sections/:id
 * Update a section. If marking as asset, unmark other sections for the same project.
 */
sectionRouter.patch(
  "/:id",
  bodySchemaValidator(updateSectionData),
  sectionController.updateSection,
);

/**
 * DELETE /api/sections/:id
 * Delete a section.
 */
sectionRouter.delete("/:id", sectionController.deleteSection);

/**
 * POST /api/sections/:id
 * Delete a section.
 */
sectionRouter.post("/:id/restore", sectionController.restoreSection);

/**
 * POST /api/sections/:id/change-rank
 * Change the rank of a section (swap with the adjacent section).
 * Expected payload might include { direction: "up" } or { direction: "down" }.
 */
sectionRouter.post(
  "/:id/change-rank",
  bodySchemaValidator(changeRankData),
  sectionController.changeRank,
);

/**
 * GET /api/projects/:projectId/sections?page=&limit=
 * Get list of sections for a project/program with pagination.
 */
sectionRouter.get(
  "/:projectId/sections",
  sectionController.getSectionsByProject,
);

/**
 * GET /api/projects/:projectId/assets?page=&limit=
 * Get list of assets for a project/program with pagination.
 */
sectionRouter.get(
  "/:projectId/assets",
  sectionController.getAssetsOfProject,
);

export default sectionRouter;
