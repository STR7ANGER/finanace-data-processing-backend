import { Router } from "express";
import { validate } from "../../shared/middleware/validate";
import { loginSchema } from "./auth.schema";
import { login } from "./auth.controller";

const router = Router();

router.post("/login", validate(loginSchema), login);

export default router;
