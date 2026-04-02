import bcrypt from "bcryptjs";
import { prisma } from "../../shared/lib/db";
import { Role, Status } from "../../shared/types/constants";

export function sanitizeUser(user: any) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

export async function listUsers() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return users.map(sanitizeUser);
}

export async function createUser(payload: {
  email: string;
  name: string;
  password: string;
  role?: Role;
  status?: Status;
}) {
  const passwordHash = await bcrypt.hash(payload.password, 10);
  return prisma.user.create({
    data: {
      email: payload.email,
      name: payload.name,
      passwordHash,
      role: payload.role ?? "VIEWER",
      status: payload.status ?? "ACTIVE",
    },
  });
}

export async function updateUser(
  id: string,
  payload: { name?: string; password?: string; role?: Role; status?: Status }
) {
  const data: any = {
    name: payload.name,
    role: payload.role,
    status: payload.status,
    updatedAt: new Date(),
  };
  if (payload.password) {
    data.passwordHash = await bcrypt.hash(payload.password, 10);
  }
  return prisma.user.update({ where: { id }, data });
}
