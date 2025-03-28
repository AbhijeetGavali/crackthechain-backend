import { Document, Schema, Types, model } from "mongoose";

export interface IProject extends Document {
  _id: Types.ObjectId;
  projectName: string;
  companyId: Types.ObjectId;
  projectDescription: string;
  minPrice: number;
  maxPrice: number;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  serviceType: string;
  isProject: boolean;
  isPublished: boolean;
  maxPoints: number;
  isDeleted: boolean;
  deletedAt?: Date;
  softDelete(): Promise<void>;
  restoreProject(): Promise<void>;
}

export const ProjectSchema = new Schema(
  {
    projectName: { type: String, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    projectDescription: { type: String, required: true },
    minPrice: { type: Number, required: true },
    maxPrice: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    serviceType: { type: String, required: true },
    isProject: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: false },
    maxPoints: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

// Add a method for soft delete
ProjectSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return await this.save();
};

// Add a method for restore Project
ProjectSchema.methods.restoreProject = async function () {
  this.isDeleted = false;
  this.deletedAt = new Date();
  return await this.save();
};

const Project = model<IProject>("Project", ProjectSchema);

export default Project;
