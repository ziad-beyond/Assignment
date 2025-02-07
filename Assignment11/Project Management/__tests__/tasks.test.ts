import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import app from "../src/app";
import { prisma } from "../src/config";

describe('Task Endpoints', () => {
    let adminToken: string;
    let employeeToken: string;
    let projectId: string;
    let taskId: string;  
 
    const adminEmail = "admin@example.com";
    const adminPassword = "adminPassword123";
    const employeeEmail = "employee@example.com";
    const employeePassword = "employeePassword123";

    beforeAll(async () => {
        await prisma.task.deleteMany();
        await prisma.project.deleteMany();
        await prisma.user.deleteMany();
   
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
        console.log('Creating project with ownerId:', adminUser.id);
    
        const project = await prisma.project.create({
            data: {
                name: 'Test Project',
                description: 'Test Project Description',
                startDate: new Date(),
                endDate: new Date(),
                ownerId: adminUser.id, 
                status: "ToDo",
                
            },
        });
        console.log('Project created:', project);
        projectId=project.id;
    }); 

    
    afterAll(async () => {
        await prisma.task.deleteMany();
        await prisma.project.deleteMany();
        await prisma.user.deleteMany();
        await prisma.$disconnect();
    });

    it('✅ should create a new task by admin', async () => {
        const res = await request(app)
            .post(`/projects/${projectId}/tasks`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                projectId: projectId,
                description: 'Test Task created by Admin',
                dueDate: new Date(),
                status: 'ToDo',
                note: 'Test Note for admin created task',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('task');
        taskId = res.body.task.id;
    });

    it('✅ should update a task by employee', async () => {
        const res = await request(app)
            .put(`/projects/${projectId}/tasks/${taskId}`)
            .set('Authorization', `Bearer ${employeeToken}`)
            .send({
                projectId: projectId,
                description: 'Updated Task by Employee',
                dueDate: new Date(),
                status: 'Done',
                note: 'Updated by Employee',
            });
     
        console.log('Response Body:', JSON.stringify(res.body, null, 2));
        console.log('Status Code:', res.statusCode);
    
        if (res.body.errors) {
            console.log('Validation Errors:', JSON.stringify(res.body.errors, null, 2));
        }
    
        expect(res.statusCode).toEqual(200); 
        expect(res.body).toHaveProperty('task');
    });
    
    
    it('✅ should get all tasks for a project', async () => {
        const res = await request(app)
            .get(`/projects/${projectId}/tasks`)
            .set('Authorization', `Bearer ${adminToken}`); 

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    }); 

});
       