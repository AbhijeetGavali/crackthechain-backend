import { z } from "zod";

export const createSectionData = z.object({
  sectionTitle: z.string().min(1, "Section title is required"),
  sectionType: z.enum(["text", "list", "stats"]),
  sectionText: z.string().optional(),
  sectionList: z.array(z.string()).optional(),
  isAsset: z.boolean().default(false),
});

export const updateSectionData = z.object({
  sectionTitle: z.string().min(1).optional(),
  sectionType: z.enum(["text", "list", "stats"]).optional(),
  sectionText: z.string().optional(),
  sectionList: z.array(z.string()).optional(),
  isAsset: z.boolean().optional()
});

// Data for rank change payload.
export const changeRankData = z.object({
  direction: z.enum(["up", "down"]),
});

export type CreateSectionSchema = z.infer<typeof createSectionData>;
export type UpdateSectionSchema = z.infer<typeof updateSectionData>;
export type ChangeRankSchema = z.infer<typeof changeRankData>;