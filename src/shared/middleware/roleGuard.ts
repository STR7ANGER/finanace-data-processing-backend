import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth";

export function roleGuard(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (req.user.status !== "ACTIVE") {
      return res.status(403).json({ error: "InactiveUser" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    return next();
  };
}
