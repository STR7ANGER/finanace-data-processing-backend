import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";

function formatZodError(error: ZodError) {
  return error.issues.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));
}

export function validate(schema: ZodSchema, location: "body" | "query" | "params" = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse((req as any)[location]);
    if (!result.success) {
      return res.status(400).json({
        error: "ValidationError",
        details: formatZodError(result.error),
      });
    }

    if (location === "body") {
      (req as any).body = result.data;
    } else {
      (req as any).validated = {
        ...(req as any).validated,
        [location]: result.data,
      };
    }

    return next();
  };
}
