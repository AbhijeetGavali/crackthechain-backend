import { Router } from "express";
import UserController from "../controllers/users.controller";
import { verifyJWT } from "../helpers/token";
import { bodySchemaValidator } from "../middlewares/schema.validator";
import { updateUserData } from "../schemas/auth";

const userRouter = Router({ mergeParams: true });

const userController = new UserController();

userRouter.get("/profile", verifyJWT, userController.getUserProfile);

/**
 * GET /api/users?page=&limit=
 * Get all users.
 */
userRouter.get("/", userController.getUsers);

/**
 * GET /api/users/top
 * Get user details including its sections.
 */
userRouter.get("/top", userController.getTopUsers);

/**
 * GET /api/users/:id
 * Get user details including its sections.
 */
userRouter.get("/:id", userController.getUserDetails);

/**
 * PUT /api/users/:id
 * Update an existing user.
 */
userRouter.patch(
  "/:id",
  verifyJWT,
  bodySchemaValidator(updateUserData),
  userController.updateUser,
);

/**
 * DELETE /api/users/:id
 * Delete a user.
 */
userRouter.delete("/:id", userController.deleteUser);

/**
 * POST /api/users/:id/restore
 * Restore a user.
 */
userRouter.post("/:id/restore", userController.restoreUser);

export default userRouter;
