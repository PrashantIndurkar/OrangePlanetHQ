import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
	createTask,
	deleteTask,
	getTask,
	listTasks,
	updateTask,
} from "./tasks.controller.js";
import {
	createTaskSchema,
	listTasksQuerySchema,
	taskIdParamsSchema,
	updateTaskSchema,
} from "./tasks.schema.js";

const router = Router();

// Protect all routes under this module
router.use(authMiddleware);

router.post("/", validate({ body: createTaskSchema }), createTask);
router.get("/", validate({ query: listTasksQuerySchema }), listTasks);
router.get("/:id", validate({ params: taskIdParamsSchema }), getTask);
router.patch(
	"/:id",
	validate({ params: taskIdParamsSchema, body: updateTaskSchema }),
	updateTask,
);
router.delete("/:id", validate({ params: taskIdParamsSchema }), deleteTask);

export default router;
