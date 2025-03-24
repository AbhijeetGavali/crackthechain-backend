import { Request, Response } from "express";
import { buildResponse } from "../common/utils";
import { errorHandler } from "../common/errors";
import ReportService from "../services/report.service";

class ReportController {
  private _reportService = new ReportService();

  // POST /api/reports
  createReport = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const savedReport = await this._reportService.createReport(data);
      res
        .status(201)
        .send(buildResponse(savedReport, "Report created successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  // PUT /api/reports/:id
  updateReport = async (req: Request, res: Response) => {
    try {
      const reportId = req.params.id;
      const data = req.body;
      const updatedReport = await this._reportService.updateReport(
        reportId,
        data,
      );
      if (!updatedReport) {
        res.status(404).send(buildResponse(null, "Report not found"));
        return;
      }
      res
        .status(200)
        .send(buildResponse(updatedReport, "Report updated successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  // DELETE /api/reports/:id
  deleteReport = async (req: Request, res: Response) => {
    try {
      const reportId = req.params.id;
      const deletedReport = await this._reportService.deleteReport(reportId);
      if (!deletedReport) {
        res.status(404).send(buildResponse(null, "Report not found"));
        return;
      }
      res
        .status(200)
        .send(buildResponse(deletedReport, "Report deleted successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  // POST /api/reports/:id/restore
  restoreReport = async (req: Request, res: Response) => {
    try {
      const reportId = req.params.id;
      const restoredReport = await this._reportService.restoreReport(reportId);
      if (!restoredReport) {
        res.status(404).send(buildResponse(null, "Report not found"));
        return;
      }
      res
        .status(200)
        .send(buildResponse(restoredReport, "Report restored successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  // POST /api/reports/:id/publish
  publishReport = async (req: Request, res: Response) => {
    try {
      const reportId = req.params.id;
      const updatedReport = await this._reportService.publishReport(reportId);
      if (!updatedReport) {
        res.status(404).send(buildResponse(null, "Report not found"));
        return;
      }
      res
        .status(200)
        .send(buildResponse(updatedReport, "Report published successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  // POST /api/reports/:id/unpublish
  unpublishReport = async (req: Request, res: Response) => {
    try {
      const reportId = req.params.id;
      const updatedReport = await this._reportService.unpublishReport(reportId);
      if (!updatedReport) {
        res.status(404).send(buildResponse(null, "Report not found"));
        return;
      }
      res
        .status(200)
        .send(buildResponse(updatedReport, "Report unpublished successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  // GET /api/reports/project/:projectId/published?page=&limit=
  getPublishedReportsByProject = async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const result = await this._reportService.getPublishedReportsByProject(
        projectId,
        page,
        limit,
      );
      res
        .status(200)
        .send(buildResponse(result, "Published reports fetched successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  // GET /api/reports/user/:userId?page=&limit=
  getReportsByUser = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const reports = await this._reportService.getReportsByUser(
        userId,
        page,
        limit,
      );
      res
        .status(200)
        .send(buildResponse(reports, "User reports fetched successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  // GET /api/reports/:id
  getReportDetails = async (req: Request, res: Response) => {
    try {
      const reportId = req.params.id;
      const report = await this._reportService.getReportDetails(reportId);
      if (!report) {
        res.status(404).send(buildResponse(null, "Report not found"));
        return;
      }
      res
        .status(200)
        .send(buildResponse({ report }, "Report details fetched successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };
}

export default ReportController;
