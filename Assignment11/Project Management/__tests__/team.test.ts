import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import app from "../src/app";
import { prisma } from "../src/config";

describe('Team and TeamMembership Endpoints', () => {
    let adminToken: string;
    let employeeToken: string;
    let teamId: string;
    let employeeId: string; 

    const adminEmail = "admin@example.com";
    const adminPassword = "adminPassword123";
    const employeeEmail = "employee@example.com";
    const employeePassword = "employeePassword123";

    beforeAll(async () => {
        await prisma.teamMembership.deleteMany();
        await prisma.team.deleteMany();
        await prisma.task.deleteMany();
        await prisma.project.deleteMany();
        await prisma.user.deleteMany();
        console.log('Database cleaned');

        // Create admin user
        const adminRes = await request(app)
            .post("/signup")
            .send({
                name: "Admin Test User",
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
            });

        const adminUser = await prisma.user.findUnique({
            where: { email: adminEmail },
        });
        console.log('Admin User:', adminUser);
        if (!adminUser) {
            throw new Error('Admin user not found');
        }

        const adminLoginRes = await request(app)
            .post("/signin")
            .send({
                email: adminEmail,
                password: adminPassword,
            });

        adminToken = adminLoginRes.body.token;

        // Create employee user
        const employeeRes = await request(app)
            .post("/signup")
            .send({
                name: "Employee Test User",
                email: employeeEmail,
                password: employeePassword,
                role: 'employee',
            });

        const employeeUser = await prisma.user.findUnique({
            where: { email: employeeEmail },
        });
        console.log('Employee User:', employeeUser);
        if (!employeeUser) {
            throw new Error('Employee user not found');
        }

        const employeeLoginRes = await request(app)
            .post("/signin")
            .send({
                email: employeeEmail,
                password: employeePassword,
            });

        employeeToken = employeeLoginRes.body.token;
        employeeId = employeeUser.id; // Store employee ID

        // Create a team by admin
        const teamRes = await request(app)
            .post("/teams")
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Test Team',
            });

        console.log('Team creation response:', teamRes.body);
        expect(teamRes.statusCode).toEqual(201);
        teamId = teamRes.body.team.id;
    });
 
    afterAll(async () => {
        await prisma.teamMembership.deleteMany();
        await prisma.team.deleteMany();
        await prisma.task.deleteMany();
        await prisma.project.deleteMany();
        await prisma.user.deleteMany();
        await prisma.$disconnect();
    });
    it('✅ should add a member to the team', async () => {
        console.log('Adding member to team...');
        console.log('Team ID:', teamId);
        console.log('Employee ID:', employeeId);
    
        const res = await request(app)
            .post(`/teams/members`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                teamId:teamId,
                userId: employeeId,  // Use employeeId here, not token
                role: 'employee',
            });
       
        console.log('Add member response:', res.body);
        expect(res.statusCode).toEqual(201);
    });
    
    it('✅ should get all members of the team', async () => {
        console.log('Getting all members of team...');
        console.log('Team ID:', teamId);
    
        const res = await request(app)
            .get(`/teams/${teamId}/`)
            .set('Authorization', `Bearer ${adminToken}`);
    
        console.log('Get members response:', res.body);
        expect(res.statusCode).toEqual(200);
    });
     
});
