import { Request, Response, NextFunction } from "express";
import { loginWithPassword } from "./auth.service";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await loginWithPassword(req.body.email, req.body.password);
    if (!result.ok) {
      if (result.error === "InactiveUser") {
        return res.status(403).json({ error: result.error });
      }
      if (result.error === "JwtSecretMissing") {
        return res.status(500).json({ error: result.error });
      }
      return res.status(401).json({ error: result.error });
    }
    return res.json(result.data);
  } catch (err) {
    return next(err);
  }
}
