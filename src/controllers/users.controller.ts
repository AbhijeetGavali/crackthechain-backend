import { RequestHandler } from "express";
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
}

export default UserController;
