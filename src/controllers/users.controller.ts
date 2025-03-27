import { Request, Response, RequestHandler } from "express";
import { buildResponse } from "../common/utils";
import UserService from "../services/users.service";
import { ValidationFailedError, errorHandler } from "../common/errors";
import { JWTRequest } from "../interfaces/express";

class UserController {
  private _usersService = new UserService();

  getUserProfile: RequestHandler = async (req: JWTRequest, res) => {
    try {
      // Fetch user by email
      const user = await this._usersService.getUserByEmail(req.jwt.email);

      // If user does not exist, throw an error
      if (!user) {
        throw new ValidationFailedError("User does not exist");
      }

      user.password = undefined;

      res
        .status(200)
        .send(buildResponse(user, "User profile fetched successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  // GET /api/users?type=user&page=&limit=
  getUsers = async (req: Request, res: Response) => {
    try {
      // isUser flag: if type is , set isUser to false.
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const results = await this._usersService.getUsers(page, limit);
      res
        .status(200)
        .send(buildResponse(results, "Users fetched successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  // GET /api/users/published?type=user|&page=&limit=
  getTopUsers = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const usersWithReportCount = await this._usersService.getTopUsers(
        page,
        limit,
      );
      res
        .status(200)
        .send(
          buildResponse(
            { users: usersWithReportCount },
            "Top users fetched successfully",
          ),
        );
    } catch (error) {
      errorHandler(res, error);
    }
  };

  // GET /api/users/:id
  getUserDetails = async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const user = await this._usersService.getUserDetailsById(userId);
      if (!user) {
        res.status(404).send(buildResponse(null, "User not found"));
        return;
      }
      // Assume that user details include sections if populated by service layer or separate query
      // For now, we return the user details only.
      res
        .status(200)
        .send(buildResponse({ user }, "User details fetched successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  // PUT /api/users/:id
  updateUser = async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const data = req.body;
      const updatedUser = await this._usersService.updateUser(userId, data);
      if (!updatedUser) {
        res.status(404).send(buildResponse(null, "User not found"));
        return;
      }
      res
        .status(200)
        .send(buildResponse(updatedUser, "User updated successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  // DELETE /api/users/:id
  deleteUser = async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const deletedUser = await this._usersService.deleteUser(userId);
      if (!deletedUser) {
        res.status(404).send(buildResponse(null, "User not found"));
        return;
      }
      res
        .status(200)
        .send(buildResponse(deletedUser, "User deleted successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  // POST /api/users/:id/restore
  restoreUser = async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const restoredUser = await this._usersService.restoreUser(userId);
      if (!restoredUser) {
        res.status(404).send(buildResponse(null, "User not found"));
        return;
      }
      res
        .status(200)
        .send(buildResponse(restoredUser, "User restored successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };
}

export default UserController;
