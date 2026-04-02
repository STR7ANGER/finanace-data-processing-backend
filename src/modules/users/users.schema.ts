import { z } from "zod";
import { ROLE_VALUES, STATUS_VALUES } from "../../shared/types/constants";

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
  role: z.enum(ROLE_VALUES).optional(),
  status: z.enum(STATUS_VALUES).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  password: z.string().min(6).optional(),
  role: z.enum(ROLE_VALUES).optional(),
  status: z.enum(STATUS_VALUES).optional(),
});
