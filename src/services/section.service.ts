import { Types } from "mongoose";
import ProjectSection from "../models/projectSection";
import { CreateSectionSchema } from "../schemas/section";

class SectionService {
  // Create a new section for a project/program.
  // If the new section is marked as asset, unmark any other section for the same project.
  createSection = async (
    data: CreateSectionSchema & { projectId: Types.ObjectId },
  ) => {
    if (data.isAsset) {
      await ProjectSection.updateMany(
        { projectId: data.projectId, isAsset: true },
        { isAsset: false },
      ).exec();
    }
    const rank = await ProjectSection.countDocuments({
      projectId: data.projectId,
    });

    const section = new ProjectSection({ ...data, rank: rank + 1 });
    return await section.save();
  };

  // Update an existing section.
  // If updating the section and marking it as asset, unmark any other section for the same project.
  updateSection = async (sectionId: string, data: any) => {
    if (data.isAsset) {
      const currentSection = await ProjectSection.findById(sectionId).exec();
      if (currentSection) {
        await ProjectSection.updateMany(
          { projectId: currentSection.projectId, isAsset: true },
          { isAsset: false },
        ).exec();
      }
    }
    return await ProjectSection.findByIdAndUpdate(sectionId, data, {
      new: true,
    }).exec();
  };

  // Delete a section.
  deleteSection = async (sectionId: string) => {
    const section = await ProjectSection.findById(sectionId);
    if (!section) return null;
    
    return await section.softDelete();
  };

  // restore a section.
  restoreSection = async (sectionId: string) => {
    const section = await ProjectSection.findById(sectionId);
    if (!section) return null;

    return await section.restoreProjectSection();
  };

  // Change the rank of a section by swapping with an adjacent section.
  // Expects the direction ("up" or "down") to swap with the section above or below.
  changeRank = async (sectionId: string, direction: string) => {
    const currentSection = await ProjectSection.findById(sectionId).exec();
    if (!currentSection) return null;

    const sortOrder = direction === "up" ? -1 : 1;
    const adjacentSection = await ProjectSection.findOne({
      projectId: currentSection.projectId,
      rank: { [direction === "up" ? "$lt" : "$gt"]: currentSection.rank },
    })
      .sort({ rank: sortOrder })
      .exec();

    if (!adjacentSection) return null;

    // Swap the rank values.
    const tempRank = currentSection.rank;
    currentSection.rank = adjacentSection.rank;
    adjacentSection.rank = tempRank;

    await currentSection.save();
    await adjacentSection.save();

    return { currentSection, adjacentSection };
  };

  // Get a list of sections for a specific project/program with pagination.
  getSectionsByProject = async (
    projectId: string,
    page: number,
    limit: number,
  ) => {
    const skip = (page - 1) * limit;

    return {
      sections: await ProjectSection.find({ projectId })
        .sort({ rank: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      pagination: {
        totalCount: await ProjectSection.countDocuments({ projectId }).exec(),
        currentPage: page,
        currentSize: limit,
      },
    };
  };
}

export default SectionService;
