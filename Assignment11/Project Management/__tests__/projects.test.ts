import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import app from "../src/app";
import { prisma } from "../src/config";

describe("Project API Tests", () => {
    let token: string;
    let projectId: string;

    const testEmail = "projecttest@example.com";
    const testPassword = "password123";

    beforeAll(async () => {
        await prisma.task.deleteMany();
        await prisma.project.deleteMany();
        await prisma.user.deleteMany();

        const res = await request(app)
        .post("/signup")
        .send({
            name: "Project Test User",
            email: testEmail,
            password: testPassword,
            role: 'admin',
        });

        const loginRes = await request(app)
        .post("/signin")
        .send({
            email: testEmail,
            password: testPassword,
        });

        token = loginRes.body.token;
    });

    afterAll(async () => {
        await prisma.task.deleteMany();
        await prisma.project.deleteMany();
        await prisma.user.deleteMany();
        await prisma.$disconnect();
    });
    

    it("✅ Should create a new project", async () => {
        const res = await request(app)
            .post("/projects")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Test Project",
                description: "A test project",
                startDate: new Date(),
                endDate: new Date,
                status: "ToDo",
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message", "Project created successfully");
        projectId = res.body.project.id;
    });

    it("✅ Should get user projects", async () => {
        const res = await request(app)
            .get("/projects")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it("✅ Should update a project", async () => {
        const res = await request(app)
            .put(`/projects/${projectId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Updated Test Project",
                description: "An updated test project",
                startDate: new Date(),
                endDate: new Date,
                status: "InProgress",
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "Project updated successfully");
    });

    it("✅ Should get project details", async () => {
        const res = await request(app)
            .get(`/projects/${projectId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("id", projectId);
    });

 

    
});
