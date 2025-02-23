import { Router } from "express";
import UserController from "../controllers/users.controller";
import { verifyJWT } from "../helpers/token";

const userRouter = Router({ mergeParams: true });

const userController = new UserController();

userRouter.get("/profile", verifyJWT, userController.getUserProfile);

export default userRouter;
