import request from "supertest";
import app from "../src/server";
import prisma from "../src/libs/prisma";

let adminToken: string;
let userId: string;

beforeAll(async () => {
  // Hapus user test jika ada
  await prisma.user.deleteMany({
    where: { email: "testuser@example.com" },
  });

  // register admin baru
  const resRegister = await request(app).post("/api/auth/register").send({
    companyName: "Test Company",
    email: "admin@test.com",
    password: "Admin123!",
    fullName: "Admin Test",
    phone: "08123456789",
  });

  // login admin untuk ambil token
  const resLogin = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@test.com", password: "Admin123!" });

  if (!resLogin.body.token) throw new Error("Login admin gagal");
  adminToken = resLogin.body.token;
});

afterAll(async () => {
  // cleanup test data
  await prisma.user.deleteMany({
    where: { email: "testuser@example.com" },
  });
  await prisma.$disconnect();
});

describe("Auth Management", () => {
  it("should register a new user (admin)", async () => {
    const res = await request(app).post("/api/auth/register").send({
      companyName: "Test Company 2",
      email: "testuser@example.com",
      password: "Pass123!",
      fullName: "Test User",
      phone: "08123456780",
    });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe("testuser@example.com");
    userId = res.body.user.id;
  });

  it("should login a user and return token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "testuser@example.com", password: "Pass123!" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("should get logged-in user info with /me", async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "testuser@example.com", password: "Pass123!" });

    const token = loginRes.body.token;

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe("testuser@example.com");
  });
});
