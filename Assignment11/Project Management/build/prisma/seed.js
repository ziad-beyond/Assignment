"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    // Create users
    const user1 = await prisma.user.create({
        data: {
            name: 'Alice',
            email: 'alice@example.com',
            password: 'password123',
            role: 'manager',
        },
    });
    const user2 = await prisma.user.create({
        data: {
            name: 'Bob',
            email: 'bob@example.com',
            password: 'password123',
            role: 'employee',
        },
    });
    // Create projects
    const project1 = await prisma.project.create({
        data: {
            name: 'Project Alpha',
            description: 'This is the first project.',
            startDate: new Date('2023-01-01'),
            endDate: new Date('2023-06-01'),
            status: 'ongoing',
        },
    });
    const project2 = await prisma.project.create({
        data: {
            name: 'Project Beta',
            description: 'This is the second project.',
            startDate: new Date('2023-02-01'),
            endDate: new Date('2023-07-01'),
            status: 'planned',
        },
    });
    // Create tasks
    await prisma.task.createMany({
        data: [
            {
                projectId: project1.id,
                assignedTo: user1.id,
                description: 'Task 1 for Project Alpha',
                dueDate: new Date('2023-03-01'),
                status: 'in-progress',
            },
            {
                projectId: project1.id,
                assignedTo: user2.id,
                description: 'Task 2 for Project Alpha',
                dueDate: new Date('2023-04-01'),
                status: 'not-started',
            },
            {
                projectId: project2.id,
                assignedTo: user1.id,
                description: 'Task 1 for Project Beta',
                dueDate: new Date('2023-05-01'),
                status: 'not-started',
            },
        ],
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
