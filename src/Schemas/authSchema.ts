import { z } from "zod";

export const RegisterUserSchema = z.object({
  firstname: z
    .string()
    .min(2, { message: "Firstname must be more than 2 characters." }),
  lastname: z
    .string()
    .min(2, { message: "Lastname must be more than 2 characters." }),
  email: z.string().email({ message: "Email is invalid." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(32, { message: "Password must not exceed 32 characters" })
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
});

export const LoginUserSchema = z.object({
  email: z.string().email({ message: "Email is invalid." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(32, { message: "Password must not exceed 32 characters" })
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
});
