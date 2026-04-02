import { Router } from "express";
import { auth } from "../../shared/middleware/auth";
import { roleGuard } from "../../shared/middleware/roleGuard";
import { validate } from "../../shared/middleware/validate";
import { createUserSchema, updateUserSchema } from "./users.schema";
import { createUserHandler, getUsers, updateUserHandler } from "./users.controller";

const router = Router();

router.get("/", auth, roleGuard(["ADMIN"]), getUsers);
router.post("/", auth, roleGuard(["ADMIN"]), validate(createUserSchema), createUserHandler);
router.patch("/:id", auth, roleGuard(["ADMIN"]), validate(updateUserSchema), updateUserHandler);

export default router;
