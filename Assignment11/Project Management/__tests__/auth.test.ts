import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import app from "../src/app";
import { prisma } from "../src/config";

describe("Auth API Tests", () => {
  let testEmail = "test@example.com";
  let testPassword = "password123";
  let token: string;

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await prisma.$disconnect();
  });

  it("✅ Should register a new user", async () => {
    const res = await request(app)
    .post("/signup")
    .send({
      name: "Test User",
      email: testEmail,
      password: testPassword,
      role: 'admin', 
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User created successfully, please login");
  });

  it("❌ Should not allow duplicate email registration", async () => {
    const res = await request(app)
    .post("/signup")
    .send({
      name: "Duplicate User",
      email: testEmail,
      password: testPassword,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Email is already in use");
  });

  it("✅ Should log in with correct credentials", async () => {
    const res = await request(app)
    .post("/signin")
    .send({
      email: testEmail,
      password: testPassword,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("❌ Should not log in with incorrect credentials", async () => {
    const res = await request(app)
    .post("/signin")
    .send({
      email: testEmail,
      password: "wrongpassword",
    });
  
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Invalid email or password");
  });

  it("❌ Should not access a protected route without a token", async () => {
    const res = await request(app)
    .get("/projects/"); 
    expect(res.statusCode).toBe(401);
  });

  it("✅ Should access a protected route with a valid token", async () => {
    const res = await request(app)
      .get("/") 
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});
