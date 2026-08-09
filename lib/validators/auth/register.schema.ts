import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.email().toLowerCase(),
  password: z.string().min(8),
  role: z.enum(["student", "teacher"]),
});

export type RegisterInput = z.infer<typeof registerSchema>;