import { Document, Schema, Types, model } from "mongoose";

export interface IProjectSection extends Document {
  _id: Types.ObjectId;
  sectionTitle: string;
  sectionType: "text" | "list" | "stats";
  sectionText?: string;
  sectionList?: string[];
  isAsset: boolean;
  rank: number;
  projectId: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
  softDelete(): Promise<void>;
  restoreProjectSection(): Promise<void>;
}

export const ProjectSectionSchema = new Schema(
  {
    sectionTitle: { type: String, required: true },
    sectionType: {
      type: String,
      enum: ["text", "list", "stats"],
      required: true,
    },
    sectionText: { type: String },
    sectionList: { type: [String] },
    isAsset: { type: Boolean, default: false },
    rank: { type: Number, required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

// Add a method for soft delete
ProjectSectionSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return await this.save();
};

ProjectSectionSchema.methods.restoreProjectSection = async function () {
  this.isDeleted = false;
  this.deletedAt = new Date();
  return await this.save();
};

const ProjectSection = model<IProjectSection>(
  "ProjectSection",
  ProjectSectionSchema,
);

export default ProjectSection;
