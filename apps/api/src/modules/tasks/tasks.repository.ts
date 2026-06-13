import { prisma } from "../../lib/prisma.js";

export interface ListTasksFilters {
	userId: string;
	status?: string[];
	priority?: string[];
	search?: string;
	sortBy: "createdAt" | "dueDate" | "priority";
	sortOrder: "asc" | "desc";
	page: number;
	limit: number;
}

export const tasksRepository = {
	async create(
		userId: string,
		data: {
			title: string;
			description?: string | null;
			status?: string;
			priority?: string;
			dueDate?: Date | null;
		},
	) {
		return prisma.task.create({
			data: {
				...data,
				userId,
			},
		});
	},

	async findByIdAndUser(id: string, userId: string) {
		return prisma.task.findFirst({
			where: {
				id,
				userId,
			},
		});
	},

	async list(filters: ListTasksFilters) {
		const { userId, status, priority, search, sortBy, sortOrder, page, limit } =
			filters;
		const skip = (page - 1) * limit;

		const whereClause: any = {
			userId,
		};

		if (status && status.length > 0) {
			whereClause.status = { in: status };
		}

		if (priority && priority.length > 0) {
			whereClause.priority = { in: priority };
		}

		if (search) {
			whereClause.OR = [
				{ title: { contains: search, mode: "insensitive" } },
				{ description: { contains: search, mode: "insensitive" } },
			];
		}

		const [tasks, total] = await Promise.all([
			prisma.task.findMany({
				where: whereClause,
				orderBy: {
					[sortBy]: sortOrder,
				},
				skip,
				take: limit,
			}),
			prisma.task.count({ where: whereClause }),
		]);

		return { tasks, total };
	},

	async update(
		id: string,
		data: {
			title?: string;
			description?: string | null;
			status?: string;
			priority?: string;
			dueDate?: Date | null;
		},
	) {
		return prisma.task.update({
			where: { id },
			data,
		});
	},

	async delete(id: string) {
		return prisma.task.delete({
			where: { id },
		});
	},
};
