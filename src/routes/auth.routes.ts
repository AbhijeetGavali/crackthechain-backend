import { Router } from "express";
import { bodySchemaValidator } from "../middlewares/schema.validator";
import AuthController from "../controllers/auth.controller";
import {
  SendRequestResetPasswordData,
  SignUpData,
  SignInData,
} from "../schemas/auth";

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

export default authRouter;
