import { z } from "zod";
import { dateParser } from "./helper";

export const createProjectData = z.object({
  projectName: z.string().min(1, "Project name is required"),
  companyId: z.string(),
  projectDescription: z.string().min(1, "Project description is required"),
  minPrice: z.number(),
  maxPrice: z.number(),
  startDate: dateParser,
  endDate: dateParser,
  startTime: z.string(),
  endTime: z.string(),
  serviceType: z.string().min(1, "Service type is required"),
  isProject: z.boolean().default(true),
  maxPoints: z.number(),
});

export const updateProjectData = z.object({
  projectName: z.string().min(1).optional(),
  projectDescription: z.string().min(1).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  startDate: dateParser,
  endDate: dateParser,
  startTime: z.string(),
  endTime: z.string(),
  serviceType: z.string().optional(),
  maxPoints: z.number().optional(),
});

export type CreateProjectDataScehema = z.infer<typeof createProjectData>;
export type UpdateProjectDataScehema = z.infer<typeof updateProjectData>;
