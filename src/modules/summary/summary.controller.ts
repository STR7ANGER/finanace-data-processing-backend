import { Request, Response, NextFunction } from "express";
import { getCategoryTotals, getRecent, getTotals, getTrends } from "./summary.service";

export async function totals(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getTotals();
    return res.json(data);
  } catch (err) {
    return next(err);
  }
}

export async function categories(req: Request, res: Response, next: NextFunction) {
  try {
    const query = (req as any).validated?.query ?? req.query;
    const data = await getCategoryTotals((query as any).type);
    return res.json({ data });
  } catch (err) {
    return next(err);
  }
}

export async function trends(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getTrends();
    return res.json({ data });
  } catch (err) {
    return next(err);
  }
}

export async function recent(req: Request, res: Response, next: NextFunction) {
  try {
    const query = (req as any).validated?.query ?? req.query;
    const data = await getRecent((query as any).limit || 10);
    return res.json({ data });
  } catch (err) {
    return next(err);
  }
}
