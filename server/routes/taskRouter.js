import express from 'express';
import { createTask, getTasks, updateTaskStatus, deleteTask } from '../controllers/taskController.js';
import { protectRoute } from '../middleware/auth.js';

const taskRouter = express.Router();

taskRouter.post('/', protectRoute, createTask);
taskRouter.get('/', protectRoute, getTasks);
taskRouter.put('/:id', protectRoute, updateTaskStatus);
taskRouter.delete('/:id', protectRoute, deleteTask);

export default taskRouter;
