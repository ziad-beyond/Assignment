import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import prisma from "../config/prisma";
import { AuthenticatedRequest } from "../middleware/authenticate";
import badRequest from "../errors/badRequest";
import NotFound from "../errors/notFound";



export const createProject = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new badRequest("User ID is required");
    }
    const { name, description, startDate, endDate, status, teamId } = req.body;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        ownerId: userId,
        status,
        teamId,
        tasks: {
          create: [],
        },
      },
    });

    if (!project) {
      throw new Error("Couldn't add project");
    }
    res.status(201).json({
      message: "Project created successfully",
      project
    });
  } catch (error: any) {
    next(error);
  }
};

export const updateProject = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    const projectId = req.params.projectId;
    const { name, description, startDate, endDate, status, teamId } = req.body;

    if (!userId) {
      throw new badRequest("User ID is required");
    }
    if (!projectId) {
      throw new badRequest("Project ID is required");
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        ownerId: userId,
      },
    });

    if (!project) {
      throw new NotFound("Project not found");
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        status,
        teamId,
      },
    });

    res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error: any) {
    next(error);
  }
};

export const deleteProject = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    const projectId = req.params.projectId;

    if (!userId) {
      throw new badRequest("User ID is required");
    }
    if (!projectId) {
      throw new badRequest("Project ID is required");
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        ownerId: userId,
      },
    });

    if (!project) {
      throw new NotFound("Project not found");
    }

    await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error: any) {
    next(error);
  }
};

export const getUserProjects = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new badRequest("User ID is required");
    }
    const projects = await prisma.project.findMany({
      where: {
        ownerId: userId,
      },
    });
    if (projects.length > 0) {
      res.status(200).json(projects);
    } else {
      throw new NotFound("No projects found for this user");
    }
  } catch (error: any) {
    next(error);
  }
};

export const getProjectDetails = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    const projectId = req.params.projectId;
    if (!userId) {
      throw new badRequest("User ID is required");
    }
    if (!projectId) {
      throw new badRequest("Project ID is required");
    }
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });
    if (project) {
      res.status(200).json(project);
    } else {
      throw new NotFound("Project not found");
    }
  } catch (error: any) {
    next(error);
  }
};

export const createTeam = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, memberIds=[] } = req.body;

    const team = await prisma.team.create({
      data: {
        name,
        memberships: {
          connect: memberIds.map((id: string) => ({ id })),
        },
      },
    });

    res.status(201).json({
      message: "Team created successfully",
      team,
    });
  } catch (error: any) {
    next(error);
  }
};

export const updateTeam = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const teamId = req.params.teamId;
    const { name, memberIds } = req.body;

    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFound("Team not found");
    }

    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: {
        name,
        memberships: {
          set: memberIds.map((id: string) => ({ userId: id })),
        },
      },
    });

    res.status(200).json({
      message: "Team updated successfully",
      team: updatedTeam,
    });
  } catch (error: any) {
    next(error);
  }
};

export const deleteTeam = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const teamId = req.params.teamId;

    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFound("Team not found");
    }

    await prisma.team.delete({
      where: { id: teamId },
    });

    res.status(200).json({
      message: "Team deleted successfully",
    });
  } catch (error: any) {
    next(error);
  }
};

export const getTeamDetails = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const teamId = req.params.teamId;

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { memberships: true, projects: true },
    });

    if (team) {
      res.status(200).json(team);
    } else {
      throw new NotFound("Team not found");
    }
  } catch (error: any) {
    next(error);
  }
};

export const addTaskToProject = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    const { description, dueDate, status, note } = req.body;
    const projectId = req.params.projectId;

    if (!userId) {
      throw new badRequest("User ID is required");
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        ownerId: userId,
      },
    });

    if (!project) {
      throw new NotFound("Project not found");
    }

    const newTask = await prisma.task.create({
      data: {
        projectId: projectId,
        description,
        dueDate: new Date(dueDate),
        status,
        note,
      },
    });

    if (newTask) {
      res
        .status(201)
        .json({
          message: "Task added successfully",
          task: newTask,
        });
    } else {
      throw new Error("Couldn't add task");
    }
  } catch (error: any) {
    next(error);
  }
};


export const updateTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId, taskId } = req.params;  
    const { description, dueDate, status, note } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
       res.status(404).json({ message: "Project not found" });
    }


    if (!description && !dueDate && !status && !note) {
       res.status(400).json({ message: "No update fields provided" });
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
       res.status(404).json({ message: "Task not found" });
    }
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        status,
        note,
      },
    });

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    next(error);
  }
};


export const getTaskDetails = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.userId;
        const taskID = req.params.taskID;

        if (!userId) {
            throw new badRequest("User ID is required");
        }
        if (!taskID) {
            throw new badRequest("Task ID is required");
        }

        const task = await prisma.task.findUnique({
            where: {
                id: taskID,
            },
        });

        if (task) {
            res.status(200).json(task);
        } else {
            throw new NotFound("Task not found");
        }
    } catch (error: any) {
        next(error);
    }
};
export const getProjectTasks = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.userId;
        const projectId = req.params.projectId;

        if (!userId) {
            throw new badRequest("User ID is required");
        }
        if (!projectId) {
            throw new badRequest("Project ID is required");
        }

        const tasks = await prisma.task.findMany({
            where: {
                projectId: projectId,
            },
        });

        if (tasks.length > 0) {
            res.status(200).json(tasks);
        } else {
            throw new NotFound("No tasks found for this project");
        }
    } catch (error: any) {
        next(error);
    }
};



export const addTeamMember = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { teamId, userId, role } = req.body;

    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFound("Team not found");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFound("User not found");
    }

    const teamMembership = await prisma.teamMembership.create({
      data: {
        teamId,
        userId,
        role,
      },
    });

    res.status(201).json({
      message: "Team member added successfully",
      teamMembership,
    });
  } catch (error: any) {
    next(error);
  }
};
