import { RequestHandler } from "express";
import * as dotenv from "dotenv";
import * as bcrypt from "bcrypt";
import {
  SendRequestResetPasswordDataScehema,
  SignUpDataScehema,
  SignInDataScehema,
} from "../schemas/auth";
import UserService from "../services/users.service";
import { buildResponse } from "../common/utils";
import { ValidationFailedError, errorHandler } from "../common/errors";
import { getToken } from "../helpers/token";
import { JWTRequest } from "../interfaces/express";
import { emailTemplate } from "../common/emailTemplate";
import EmailService from "../services/mail.service";
import { FRONTEND_WEB_URL } from "../common/constants";

dotenv.config();

class AuthController {
  _userService = new UserService();

  signup: RequestHandler = async (req, res) => {
    try {
      const signUpData: SignUpDataScehema = req.body;

      // Check if user already exists
      const authCodeValid = await this._userService.getAuthCodeValidity(
        signUpData.authCode,
      );

      const existingUser = await this._userService.getUserByEmail(
        signUpData.email,
      );

      if (existingUser) {
        throw new ValidationFailedError("User already exists");
      }

      if (!authCodeValid) {
        throw new ValidationFailedError("Auth Code Not Valid");
      }

      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(signUpData.password, 10);

      // Store user with hashed password
      const newUser = await this._userService.createUser({
        ...signUpData,
        password: hashedPassword,
      });

      // Generate JWT token
      const jwtToken: string = await getToken(
        {
          email: signUpData.email,
          uid: newUser._id,
          claim: newUser.loginType,
        },
        3,
      );

      await EmailService.sendEmail({
        to: signUpData.email,
        subject:
          "SIGNUP: Your account is created on CrackTheChain Platform. Please verify your email.",
        html: emailTemplate.signupEmail(jwtToken),
      });

      res.status(200).send(buildResponse({ jwtToken }, "Signup successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  verifyEmail: RequestHandler = async (req: JWTRequest, res) => {
    try {
      const { email } = req.jwt;
      const result = await this._userService.verifyUserByEmail(email);
      if (!result) {
        throw new ValidationFailedError("User does not exist");
      }
      res.redirect(`${FRONTEND_WEB_URL}/`);
    } catch (error) {
      errorHandler(res, error);
    }
  };

  signin: RequestHandler = async (req: JWTRequest, res) => {
    try {
      const { email, password, loginType }: SignInDataScehema = req.body;

      // Find user by email
      const userDocument = await this._userService.getUserByEmail(email);
      if (!userDocument || !userDocument.password) {
        throw new ValidationFailedError("User does not exist");
      }

      if (userDocument.isDeleted) {
        throw new ValidationFailedError("User restricted by ADMIN");
      }

      if (
        userDocument.loginType != "admin" &&
        userDocument.loginType !== loginType
      ) {
        throw new ValidationFailedError("Invalid login type");
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(
        password,
        userDocument.password,
      );
      if (!isPasswordValid) {
        throw new ValidationFailedError("Invalid password");
      }

      // Generate JWT token
      const jwtToken: string = await getToken(
        {
          email: userDocument.email,
          uid: userDocument._id,
          claim: userDocument.loginType,
        },
        3,
      );

      res.status(200).send(buildResponse({ jwtToken }, "Login successful"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  sendRequestResetPassword: RequestHandler = async (req, res) => {
    try {
      const { email }: SendRequestResetPasswordDataScehema = req.body;
      const result = await this._userService.getUserByEmail(email);
      if (!result) {
        throw new ValidationFailedError("User does not exist");
      }
      const resetToken = await getToken(
        {
          email: email,
          uid: result._id,
          claim: "resetPassword",
        },
        1,
      );
      await EmailService.sendEmail({
        to: email,
        subject: "RESET: you have requested to reset your password.",
        html: emailTemplate.resetPassword(resetToken),
      });
      res.status(200).send(buildResponse(null, "Password reset successful"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  updatePassword: RequestHandler = async (req: JWTRequest, res) => {
    try {
      const { password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await this._userService.updatePassword(
        req.jwt.uid,
        hashedPassword,
      );
      res.status(200).send(buildResponse(result, ""));
    } catch (error) {
      errorHandler(res, error);
    }
  };
}

export default AuthController;
