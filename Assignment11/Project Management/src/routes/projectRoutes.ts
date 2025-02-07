import { Router } from "express";
import * as projectsController from'../controllers/projectController';
import {TaskSchema, ProjectSchema, StatusEnum } from "../schemas/projects";
import { validateBody } from "../middleware/validation";
import {authenticate} from "../middleware/authenticate"
const router = Router();

 router.post("/projects", validateBody(ProjectSchema), authenticate(['admin']), projectsController.createProject);
 router.get("/projects", authenticate(['admin']), projectsController.getUserProjects);
 router.put("/projects/:projectId", validateBody(ProjectSchema), authenticate(['admin']), projectsController.updateProject);
 router.delete("/projects/:projectId", authenticate(['admin']), projectsController.deleteProject);
 router.get("/projects/:projectId", authenticate(['admin']), projectsController.getProjectDetails);

 router.post('/teams', authenticate(['admin']), projectsController.createTeam);
 router.get('/teams/:teamId', authenticate(['admin']), projectsController.getTeamDetails);
 router.put('/teams/:teamId', authenticate(['admin']), projectsController.updateTeam);
 router.delete('/teams/:teamId', authenticate(['admin']), projectsController.deleteTeam);  
 
 router.post("/teams/members", authenticate(['admin']), projectsController.addTeamMember);

 router.post("/projects/:projectId/tasks", validateBody(TaskSchema), authenticate(['admin']), projectsController.addTaskToProject);
 router.put("/projects/:projectId/tasks/:taskId/", validateBody(TaskSchema),authenticate(['employee']), projectsController.updateTask);
 router.get("/projects/:projectId/tasks", authenticate(['admin']), projectsController.getProjectTasks);
 export default router
 