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

export {
  emailSchema,
  passwordSchema,
  loginSchema,
  type EmailSchema,
  type PasswordSchema,
  type LoginSchema,
};
