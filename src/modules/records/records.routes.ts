import { Router } from "express";
import { auth } from "../../shared/middleware/auth";
import { roleGuard } from "../../shared/middleware/roleGuard";
import { validate } from "../../shared/middleware/validate";
import { recordsQuerySchema, recordCreateSchema, recordUpdateSchema } from "./records.schema";
import { createRecordHandler, deleteRecordHandler, getRecords, updateRecordHandler } from "./records.controller";

const router = Router();

router.get(
  "/",
  auth,
  roleGuard(["VIEWER", "ANALYST", "ADMIN"]),
  validate(recordsQuerySchema, "query"),
  getRecords
);

router.post(
  "/",
  auth,
  roleGuard(["ADMIN"]),
  validate(recordCreateSchema),
  createRecordHandler
);

router.patch(
  "/:id",
  auth,
  roleGuard(["ADMIN"]),
  validate(recordUpdateSchema),
  updateRecordHandler
);

router.delete(
  "/:id",
  auth,
  roleGuard(["ADMIN"]),
  deleteRecordHandler
);

export default router;
