import bcrypt from "bcryptjs";
import { prisma } from "../src/shared/lib/db";
import { config } from "../src/shared/config/env";

async function main() {
  const email = config.adminEmail;
  const name = config.adminName;
  const password = config.adminPassword;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // eslint-disable-next-line no-console
    console.log("Admin user already exists.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  // eslint-disable-next-line no-console
  console.log("Admin user created:", email);
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
