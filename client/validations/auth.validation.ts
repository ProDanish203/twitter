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
    .min(6, "Invalid Credentials"),
});

type PasswordSchema = z.infer<typeof passwordSchema>;

export { emailSchema, passwordSchema, type EmailSchema, type PasswordSchema };
