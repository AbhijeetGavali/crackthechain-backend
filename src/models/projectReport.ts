import { Document, Schema, Types, model } from "mongoose";

export interface IProjectReport extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  projectId: Types.ObjectId;
  selectedAsset: string;
  isDraft: boolean;
  severity: "low" | "medium" | "high" | "critical";
  reportTitle: string;
  reportDescription: string;
  points: number;
  isAccepted: boolean;
  status: "initiated" | "in discussion" | "working" | "accepted" | "rejected";
  isDeleted: boolean;
  deletedAt?: Date;
  softDelete(): Promise<void>;
  restoreReport(): Promise<void>;
}

export const ProjectReportSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    selectedAsset: { type: String, required: true },
    isDraft: { type: Boolean, default: true },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
    },
    reportTitle: { type: String, required: true },
    reportDescription: { type: String, required: true },
    points: { type: Number, required: true, default: 0 },
    isAccepted: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["initiated", "in discussion", "working", "accepted", "rejected"],
      default: "initiated",
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

// Add a method for soft delete
ProjectReportSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return await this.save();
};

ProjectReportSchema.methods.restoreReport = async function () {
  this.isDeleted = false;
  this.deletedAt = new Date();
  return await this.save();
};


const ProjectReport = model<IProjectReport>(
  "ProjectReport",
  ProjectReportSchema,
);

export default ProjectReport;

