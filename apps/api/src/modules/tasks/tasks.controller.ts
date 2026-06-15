import type { NextFunction, Request, Response } from "express";
import type { z } from "zod";
import { ApiError } from "../../utils/api-error.js";
import { realtimeService } from "../realtime/realtime.service.js";
import { tasksRepository } from "./tasks.repository.js";
import type { listTasksQuerySchema } from "./tasks.schema.js";

export const createTask = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		if (!req.user) {
			throw new ApiError(401, "Unauthorized");
		}
		const task = await tasksRepository.create(req.user.id, req.body);
		realtimeService.broadcast("task.created", task);
		res.status(201).json({ task });
	} catch (error) {
		next(error);
	}
};

export const getTask = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		if (!req.user) {
			throw new ApiError(401, "Unauthorized");
		}
		const task = await tasksRepository.findByIdAndUser(
			req.params.id,
			req.user.id,
			req.user.role,
		);
		if (!task) {
			throw new ApiError(404, "Task not found");
		}
		res.status(200).json({ task });
	} catch (error) {
		next(error);
	}
};

export const listTasks = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		if (!req.user) {
			throw new ApiError(401, "Unauthorized");
		}
		const {
			status,
			priority,
			dueDate,
			search,
			sortBy,
			sortOrder,
			page,
			limit,
			allUsers,
		} = req.query as unknown as z.infer<typeof listTasksQuerySchema>;

		const { tasks, total } = await tasksRepository.list({
			userId: req.user.id,
			status,
			priority,
			dueDate,
			search,
			sortBy,
			sortOrder,
			page,
			limit,
			allUsers,
			userRole: req.user.role,
		});

		res.status(200).json({
			tasks,
			total,
		});
	} catch (error) {
		next(error);
	}
};

export const updateTask = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		if (!req.user) {
			throw new ApiError(401, "Unauthorized");
		}
		const check = await tasksRepository.findByIdAndUser(
			req.params.id,
			req.user.id,
			req.user.role,
		);
		if (!check) {
			throw new ApiError(404, "Task not found");
		}

		const updatedTask = await tasksRepository.update(
			check.id,
			req.user.id,
			req.body,
			req.user.role,
		);
		realtimeService.broadcast("task.updated", updatedTask);
		res.status(200).json({ task: updatedTask });
	} catch (error) {
		next(error);
	}
};

export const deleteTask = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		if (!req.user) {
			throw new ApiError(401, "Unauthorized");
		}
		const check = await tasksRepository.findByIdAndUser(
			req.params.id,
			req.user.id,
			req.user.role,
		);
		if (!check) {
			throw new ApiError(404, "Task not found");
		}

		await tasksRepository.delete(check.id);
		realtimeService.broadcast("task.deleted", check);
		res.status(204).send();
	} catch (error) {
		next(error);
	}
};
