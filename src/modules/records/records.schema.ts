import { z } from "zod";
import { RECORD_TYPE_VALUES } from "../../shared/types/constants";
import { numberFromString, dateFromString } from "../../shared/utils/parse";

const dateSchema = z.preprocess(dateFromString, z.date());
const optionalDateSchema = z.preprocess(dateFromString, z.date().optional());

export const recordCreateSchema = z.object({
  amount: z.preprocess(numberFromString, z.number().finite()),
  type: z.enum(RECORD_TYPE_VALUES),
  category: z.string().min(1),
  date: dateSchema,
  description: z.string().optional(),
});

export const recordUpdateSchema = z.object({
  amount: z.preprocess(numberFromString, z.number().finite()).optional(),
  type: z.enum(RECORD_TYPE_VALUES).optional(),
  category: z.string().min(1).optional(),
  date: dateSchema.optional(),
  description: z.string().optional(),
});

export const recordsQuerySchema = z.object({
  type: z.enum(RECORD_TYPE_VALUES).optional(),
  category: z.string().min(1).optional(),
  dateFrom: optionalDateSchema,
  dateTo: optionalDateSchema,
  page: z.preprocess(numberFromString, z.number().int().min(1)).optional(),
  pageSize: z.preprocess(numberFromString, z.number().int().min(1).max(100)).optional(),
  sort: z.string().optional(),
});
