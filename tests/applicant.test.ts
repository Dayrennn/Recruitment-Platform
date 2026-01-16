import request from "supertest";
import app from "../src/server";
import prisma from "../src/libs/prisma";

let companyId: string;
let userId: string;
let positionId: string;
let applicantId: string;

beforeAll(async () => {
  // buat dummy company
  const company = await prisma.company.create({
    data: {
      name: "Test Company",
      email: "testcompany@example.com",
      phone: "08123456789",
      address: "Jakarta",
    },
  });
  companyId = company.id;

  // buat dummy user
  const user = await prisma.user.create({
    data: {
      email: "testadmin@example.com",
      password: "hashedpassword",
      fullName: "Test Admin",
      role: "ADMIN",
      companyId,
    },
  });
  userId = user.id;

  // buat dummy position
  const position = await prisma.position.create({
    data: {
      title: "Test Position",
      location: "Jakarta",
      type: "FULL_TIME",
      description: "Test Position Description",
      salary: "5-6 juta",
      isActive: true,
      companyId,
      createdById: userId,
    },
  });
  positionId = position.id;
});

afterAll(async () => {
  await prisma.applicant.deleteMany({ where: { positionId } });
  await prisma.position.delete({ where: { id: positionId } });
  await prisma.user.delete({ where: { id: userId } });
  await prisma.company.delete({ where: { id: companyId } });
  await prisma.$disconnect();
});

describe("Applicant Management", () => {
  it("should create a new applicant", async () => {
    const res = await request(app).post("/api/applicants").send({
      positionId,
      fullName: "Test Applicant",
      email: "testapplicant@example.com",
      phone: "08123456789",
      education: "S1",
      experience: 2,
      resumeUrl: "http://example.com/resume.pdf",
    });

    applicantId = res.body.id;

    expect(res.status).toBe(201);
    expect(res.body.fullName).toBe("Test Applicant");
  });

  it("should list all applicants", async () => {
    const res = await request(app).get("/api/applicants");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("should get applicant detail", async () => {
    const res = await request(app).get(`/api/applicants/${applicantId}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(applicantId);
  });

  it("should update applicant status", async () => {
    const res = await request(app)
      .patch(`/api/applicants/${applicantId}/status`)
      .send({ status: "INTERVIEW" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("INTERVIEW");
  });

  it("should update applicant notes", async () => {
    const res = await request(app)
      .patch(`/api/applicants/${applicantId}/notes`)
      .send({ notes: "Candidate looks promising" });

    expect(res.status).toBe(200);
    expect(res.body.notes).toBe("Candidate looks promising");
  });

  it("should delete applicant", async () => {
    const res = await request(app).delete(`/api/applicants/${applicantId}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Deleted Success");
  });
});
