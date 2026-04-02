import { Router } from "express";
import { auth } from "../../shared/middleware/auth";
import { roleGuard } from "../../shared/middleware/roleGuard";
import { validate } from "../../shared/middleware/validate";
import { summaryCategoriesQuerySchema, summaryRecentQuerySchema } from "./summary.schema";
import { categories, recent, totals, trends } from "./summary.controller";

const router = Router();

router.get("/totals", auth, roleGuard(["ANALYST", "ADMIN", "VIEWER"]), totals);
router.get(
  "/categories",
  auth,
  roleGuard(["ANALYST", "ADMIN", "VIEWER"]),
  validate(summaryCategoriesQuerySchema, "query"),
  categories
);
router.get("/trends", auth, roleGuard(["ANALYST", "ADMIN", "VIEWER"]), trends);
router.get(
  "/recent",
  auth,
  roleGuard(["ANALYST", "ADMIN", "VIEWER"]),
  validate(summaryRecentQuerySchema, "query"),
  recent
);

export default router;
