import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../../utils/api-error.js";
import { tasksRepository } from "./tasks.repository.js";

export const createTask = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const task = await tasksRepository.create(req.user!.id, req.body);
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
		const task = await tasksRepository.findByIdAndUser(
			req.params.id,
			req.user!.id,
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
		const { status, priority, search, sortBy, sortOrder, page, limit } =
			req.query as any;

		const { tasks, total } = await tasksRepository.list({
			userId: req.user!.id,
			status,
			priority,
			search,
			sortBy,
			sortOrder,
			page,
			limit,
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
		const check = await tasksRepository.findByIdAndUser(
			req.params.id,
			req.user!.id,
		);
		if (!check) {
			throw new ApiError(404, "Task not found");
		}

		const updatedTask = await tasksRepository.update(
			req.params.id,
			req.body,
		);
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
		const check = await tasksRepository.findByIdAndUser(
			req.params.id,
			req.user!.id,
		);
		if (!check) {
			throw new ApiError(404, "Task not found");
		}

		await tasksRepository.delete(req.params.id);
		res.status(204).send();
	} catch (error) {
		next(error);
	}
};
