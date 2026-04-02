import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/db";
import { config } from "../config/env";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
  };
}

export async function auth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, config.jwtSecret) as jwt.JwtPayload;
    const user = await prisma.user.findUnique({ where: { id: payload.sub as string } });
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    };
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
