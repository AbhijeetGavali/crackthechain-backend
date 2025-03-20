import { Router } from "express";
import {
  bodySchemaValidator,
} from "../middlewares/schema.validator";
import AuthController from "../controllers/auth.controller";
import {
  SendRequestResetPasswordData,
  SignUpData,
  SignInData,
} from "../schemas/auth";
import { tokenFromQuery, verifyJWT } from "../helpers/token";

const authRouter = Router({ mergeParams: true });

const authController = new AuthController();

authRouter.post(
  "/signup",
  bodySchemaValidator(SignUpData),
  authController.signup,
);

authRouter.post(
  "/signin",
  bodySchemaValidator(SignInData),
  authController.signin,
);

authRouter.post(
  "/request-reset-password",
  bodySchemaValidator(SendRequestResetPasswordData),
  authController.sendRequestResetPassword,
);

authRouter.get(
  "/verify-email",
  tokenFromQuery,
  verifyJWT,
  authController.verifyEmail,
);

export default authRouter;
