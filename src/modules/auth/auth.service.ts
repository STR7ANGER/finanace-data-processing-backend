import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../../shared/lib/db";
import { config } from "../../shared/config/env";

export async function loginWithPassword(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { ok: false, error: "InvalidCredentials" } as const;
  }
  if (user.status !== "ACTIVE") {
    return { ok: false, error: "InactiveUser" } as const;
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    return { ok: false, error: "InvalidCredentials" } as const;
  }

  if (!config.jwtSecret) {
    return { ok: false, error: "JwtSecretMissing" } as const;
  }

  const token = jwt.sign(
    {
      role: user.role,
      status: user.status,
    },
    config.jwtSecret as jwt.Secret,
    {
      subject: user.id,
      expiresIn: config.jwtExpiresIn as jwt.SignOptions["expiresIn"],
    }
  );

  return {
    ok: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    },
  } as const;
}
