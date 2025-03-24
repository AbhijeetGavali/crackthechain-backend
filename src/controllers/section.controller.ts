import { Request, Response } from "express";
import { buildResponse } from "../common/utils";
import { errorHandler } from "../common/errors";
import SectionService from "../services/section.service";

class SectionController {
  private _sectionService = new SectionService();

  // POST /api/projects/:projectId/sections
  createSection = async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      const data = { ...req.body, projectId };
      const savedSection = await this._sectionService.createSection(data);
      res
        .status(201)
        .send(buildResponse(savedSection, "Section created successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  // PUT /api/sections/:id
  updateSection = async (req: Request, res: Response) => {
    try {
      const sectionId = req.params.id;
      const data = req.body;
      const updatedSection = await this._sectionService.updateSection(
        sectionId,
        data,
      );
      if (!updatedSection) {
        res.status(404).send(buildResponse(null, "Section not found"));
        return;
      }
      res
        .status(200)
        .send(buildResponse(updatedSection, "Section updated successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  // DELETE /api/sections/:id
  deleteSection = async (req: Request, res: Response) => {
    try {
      const sectionId = req.params.id;
      const deletedSection =
        await this._sectionService.deleteSection(sectionId);
      if (!deletedSection) {
        res.status(404).send(buildResponse(null, "Section not found"));
        return;
      }
      res
        .status(200)
        .send(buildResponse(deletedSection, "Section deleted successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  // restore /api/sections/:id/restore
  restoreSection = async (req: Request, res: Response) => {
    try {
      const sectionId = req.params.id;
      const restoredSection =
        await this._sectionService.restoreSection(sectionId);
      if (!restoredSection) {
        res.status(404).send(buildResponse(null, "Section not found"));
        return;
      }
      res
        .status(200)
        .send(buildResponse(restoredSection, "Section restored successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  // POST /api/sections/:id/change-rank
  changeRank = async (req: Request, res: Response) => {
    try {
      const sectionId = req.params.id;
      const { direction } = req.body;
      const result = await this._sectionService.changeRank(
        sectionId,
        direction,
      );
      if (!result) {
        res
          .status(400)
          .send(
            buildResponse(
              null,
              "No adjacent section to swap with or section not found",
            ),
          );
        return;
      }
      res
        .status(200)
        .send(buildResponse(result, "Section rank swapped successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  // GET /api/projects/:projectId/sections?page=&limit=
  getSectionsByProject = async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const sections = await this._sectionService.getSectionsByProject(
        projectId,
        page,
        limit,
      );
      res
        .status(200)
        .send(buildResponse(sections, "Sections fetched successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };
}

export default SectionController;
