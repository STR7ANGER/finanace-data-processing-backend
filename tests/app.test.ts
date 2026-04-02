import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../src/app";
import { prisma } from "../src/shared/lib/db";

beforeAll(async () => {
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Record" RESTART IDENTITY CASCADE');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "User" RESTART IDENTITY CASCADE');

  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin",
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

test("login succeeds and returns JWT", async () => {
  const res = await request(app)
    .post("/auth/login")
    .send({ email: "admin@example.com", password: "admin123" });

  expect(res.status).toBe(200);
  expect(res.body.token).toBeDefined();
});

test("viewer cannot create record", async () => {
  const passwordHash = await bcrypt.hash("viewer123", 10);
  await prisma.user.create({
    data: {
      email: "viewer@example.com",
      name: "Viewer",
      passwordHash,
      role: "VIEWER",
      status: "ACTIVE",
    },
  });

  const login = await request(app)
    .post("/auth/login")
    .send({ email: "viewer@example.com", password: "viewer123" });

  const res = await request(app)
    .post("/records")
    .set("Authorization", `Bearer ${login.body.token}`)
    .send({
      amount: 100,
      type: "INCOME",
      category: "Sales",
      date: new Date().toISOString(),
    });

  expect(res.status).toBe(403);
});

test("admin can create record and see it in list", async () => {
  const login = await request(app)
    .post("/auth/login")
    .send({ email: "admin@example.com", password: "admin123" });

  const create = await request(app)
    .post("/records")
    .set("Authorization", `Bearer ${login.body.token}`)
    .send({
      amount: 250.5,
      type: "EXPENSE",
      category: "Operations",
      date: new Date().toISOString(),
      description: "Cloud bill",
    });

  expect(create.status).toBe(201);

  const list = await request(app)
    .get("/records")
    .set("Authorization", `Bearer ${login.body.token}`);

  expect(list.status).toBe(200);
  expect(list.body.total).toBeGreaterThan(0);
});

test("summary totals return expected keys", async () => {
  const login = await request(app)
    .post("/auth/login")
    .send({ email: "admin@example.com", password: "admin123" });

  const res = await request(app)
    .get("/summary/totals")
    .set("Authorization", `Bearer ${login.body.token}`);

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("totalIncome");
  expect(res.body).toHaveProperty("totalExpenses");
  expect(res.body).toHaveProperty("netBalance");
});
