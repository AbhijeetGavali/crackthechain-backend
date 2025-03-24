import { Router } from "express";
import userRouter from "./users.routes";
import authRouter from "./auth.routes";
import projectRouter from "./projects.routes";
import projectSectionRouter from "./sections.routes";
import projectReportRouter from "./reports.routes";

const router = Router({ mergeParams: true });

router.use("/users/data", userRouter);
router.use("/users/auth", authRouter);
router.use("/project", projectRouter);
router.use("/project-section", projectSectionRouter);
router.use("/project-report", projectReportRouter);

export default router;
