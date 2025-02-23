import { z } from "zod";

export const SignInData = z.object({
  email: z.string().email(),
  loginType: z.enum(["researcher", "company"]),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character",
    ),
});

export const SignUpData = z.object({
  companyName: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email(),
  authCode: z.string(),
  loginType: z.enum(["researcher", "company"]),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character",
    ),
});

export const SendRequestResetPasswordData = z.object({
  email: z.string().email(),
});

export type SignInDataScehema = z.infer<typeof SignInData>;
export type SignUpDataScehema = z.infer<typeof SignUpData>;
export type SendRequestResetPasswordDataScehema = z.infer<
  typeof SendRequestResetPasswordData
>;
