import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../shared/middleware/auth";
import { createRecord, deleteRecord, listRecords, updateRecord } from "./records.service";

export async function getRecords(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const query = (req as any).validated?.query ?? req.query;
    const result = await listRecords(query as any);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

export async function createRecordHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const record = await createRecord(req.body, req.user!.id);
    return res.status(201).json({ data: record });
  } catch (err) {
    return next(err);
  }
}

export async function updateRecordHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const record = await updateRecord(String(req.params.id), req.body);
    return res.json({ data: record });
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "RecordNotFound" });
    }
    return next(err);
  }
}

export async function deleteRecordHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    await deleteRecord(String(req.params.id));
    return res.status(204).send();
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "RecordNotFound" });
    }
    return next(err);
  }
}
