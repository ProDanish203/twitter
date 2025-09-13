import { z } from "zod";

const emailSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email address" })
    .min(1, "Email is required"),
});

type EmailSchema = z.infer<typeof emailSchema>;

const passwordSchema = z.object({
  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required"),
});

type PasswordSchema = z.infer<typeof passwordSchema>;

const loginSchema = emailSchema.merge(passwordSchema);

type LoginSchema = z.infer<typeof loginSchema>;

const forgotPasswordSchema = z.object({
  identifier: z
    .string({ message: "Email, phone number, or username is required" })
    .min(1, "Email, phone number, or username is required"),
});

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

const otpSchema = z.object({
  otp: z
    .number({
      error: "Please enter the OTP sent to your email or phone number.",
    })
    .min(100000, "OTP must be 6 digits")
    .max(999999, "OTP must be 6 digits"),
});

type OtpSchema = z.infer<typeof otpSchema>;

const signupSchema = z.object({
  name: z.string({ message: "Name is required" }).min(1, "Name is required"),
  email: z
    .string({ message: "Email is required" })
    .min(1, "Email is required")
    .email({ message: "Invalid email address" }),
  month: z.string({ message: "Month is required" }).min(1, "Month is required"),
  day: z.string({ message: "Day is required" }).min(1, "Day is required"),
  year: z.string({ message: "Year is required" }).min(1, "Year is required"),
});

type SignupSchema = z.infer<typeof signupSchema>;

const createPasswordSchema = z.object({
  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be at most 32 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

type CreatePasswordSchema = z.infer<typeof createPasswordSchema>;

export {
  emailSchema,
  passwordSchema,
  loginSchema,
  forgotPasswordSchema,
  otpSchema,
  signupSchema,
  createPasswordSchema,
  type ForgotPasswordSchema,
  type EmailSchema,
  type PasswordSchema,
  type LoginSchema,
  type OtpSchema,
  type SignupSchema,
  type CreatePasswordSchema,
};
