import request from "supertest";
import app from "../src/server";
import prisma from "../src/libs/prisma";

let token: string;

beforeAll(async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@majujaya.com", password: "Pass123!" });

  if (!res.body.token) throw new Error("Login admin failed");
  token = res.body.token;
});

afterAll(async () => {
  await prisma.user.deleteMany({
    where: { email: "testrecruiter@example.com" },
  });
  await prisma.$disconnect();
});

describe("User Management", () => {
  it("should create a recruiter user", async () => {
    const res = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "testrecruiter@example.com",
        password: "Pass123!",
        fullName: "Test Recruiter",
        role: "RECRUITER",
      });

    // Pastikan status 201
    expect(res.status).toBe(201);

    // Pastikan user yang dibuat benar
    expect(res.body.user.email).toBe("testrecruiter@example.com");
    expect(res.body.user.role).toBe("RECRUITER");
  });

  it("should list users in the same company", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.users.length).toBeGreaterThan(0);
  });
});
