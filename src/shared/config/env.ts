import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  adminEmail: process.env.ADMIN_EMAIL || "admin@example.com",
  adminName: process.env.ADMIN_NAME || "Admin",
  adminPassword: process.env.ADMIN_PASSWORD || "admin123",
};
