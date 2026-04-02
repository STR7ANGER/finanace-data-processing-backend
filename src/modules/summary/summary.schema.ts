import { z } from "zod";
import { RECORD_TYPE_VALUES } from "../../shared/types/constants";
import { numberFromString } from "../../shared/utils/parse";

export const summaryCategoriesQuerySchema = z.object({
  type: z.enum(RECORD_TYPE_VALUES).optional(),
});

export const summaryRecentQuerySchema = z.object({
  limit: z.preprocess(numberFromString, z.number().int().min(1).max(100)).optional(),
});
