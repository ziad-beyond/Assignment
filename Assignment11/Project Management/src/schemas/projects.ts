import { z } from 'zod';

const StatusEnum = z.enum(['ToDo', 'InProgress', 'Done', 'Failed']);

const TaskSchema = z.object({
    projectId: z.string().uuid(),
    description: z.string(),
    dueDate: z.string(),
    status: StatusEnum,
    note: z.string().optional(),
});

const ProjectSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    startDate: z.string(),
    endDate: z.string(),
    status: StatusEnum,
    tasks: z.array(TaskSchema).optional(),
});

export { TaskSchema, ProjectSchema, StatusEnum };