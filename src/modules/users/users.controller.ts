import { Request, Response, NextFunction } from "express";
import { createUser, listUsers, sanitizeUser, updateUser } from "./users.service";

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await listUsers();
    return res.json({ data });
  } catch (err) {
    return next(err);
  }
}

export async function createUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const created = await createUser(req.body);
    return res.status(201).json({ data: sanitizeUser(created) });
  } catch (err: any) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "EmailAlreadyExists" });
    }
    return next(err);
  }
}

export async function updateUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const updated = await updateUser(String(req.params.id), req.body);
    return res.json({ data: sanitizeUser(updated) });
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "UserNotFound" });
    }
    return next(err);
  }
}
