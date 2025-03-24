import { z } from "zod";

export const createReportData = z.object({
  userId: z.string().min(1, "User ID is required"),
  projectId: z.string().min(1, "Project ID is required"),
  selectedAsset: z.string().min(1, "Selected asset is required"),
  severity: z.enum(["low", "medium", "high", "critical"]),
  reportTitle: z.string().min(1, "Report title is required"),
  reportDescription: z.string().min(1, "Report description is required"),
});

export const updateReportData = z.object({
  selectedAsset: z.string().optional(),
  isDraft: z.boolean().optional(),
  severity: z.enum(["low", "medium", "high", "critical"]).optional(),
  reportTitle: z.string().optional(),
  reportDescription: z.string().optional(),
});

export type CreateReportSchema = z.infer<typeof createReportData>;
export type UpdateReportSchema = z.infer<typeof updateReportData>;
