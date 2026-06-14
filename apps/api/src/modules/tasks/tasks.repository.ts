import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

export interface ListTasksFilters {
	userId: string;
	status?: string[];
	priority?: string[];
	dueDate?: string[];
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
		const user = await prisma.user.findUnique({ where: { id: userId } });
		const userName = user?.name || "Unknown User";
		const userInitials =
			userName
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 1) || "U";

		return prisma.$transaction(async (tx) => {
			const lastTask = await tx.task.findFirst({
				where: { userId },
				orderBy: { issueNumber: "desc" },
			});
			const issueNumber = (lastTask?.issueNumber || 0) + 1;

			const task = await tx.task.create({
				data: {
					...data,
					userId,
					issueNumber,
				},
			});

			await tx.activityLog.create({
				data: {
					taskId: task.id,
					userId,
					userName,
					userInitials,
					actionText: "created this issue",
				},
			});

			return task;
		});
	},

	async findByIdOrNumberAndUser(idOrCode: string, userId: string) {
		if (idOrCode.toUpperCase().startsWith("STR-")) {
			const numPart = idOrCode.slice(4);
			const issueNumber = parseInt(numPart, 10);
			if (Number.isNaN(issueNumber)) return null;
			return prisma.task.findFirst({
				where: {
					issueNumber,
					userId,
				},
				include: {
					activities: {
						orderBy: {
							timestamp: "asc",
						},
					},
					user: {
						select: {
							id: true,
							email: true,
							name: true,
							role: true,
						},
					},
				},
			});
		}

		// Try as UUID
		const isUuid =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
				idOrCode,
			);
		if (!isUuid) return null;

		return prisma.task.findFirst({
			where: {
				id: idOrCode,
				userId,
			},
			include: {
				activities: {
					orderBy: {
						timestamp: "asc",
					},
				},
				user: {
					select: {
						id: true,
						email: true,
						name: true,
						role: true,
					},
				},
			},
		});
	},

	async findByIdAndUser(id: string, userId: string) {
		return this.findByIdOrNumberAndUser(id, userId);
	},

	async list(filters: ListTasksFilters) {
		const {
			userId,
			status,
			priority,
			dueDate,
			search,
			sortBy,
			sortOrder,
			page,
			limit,
		} = filters;
		const skip = (page - 1) * limit;

		const whereClause: Prisma.TaskWhereInput = {
			userId,
		};

		if (status && status.length > 0) {
			whereClause.status = { in: status };
		}

		if (priority && priority.length > 0) {
			whereClause.priority = { in: priority };
		}

		if (dueDate && dueDate.length > 0) {
			const now = new Date();
			const todayStart = new Date(
				now.getFullYear(),
				now.getMonth(),
				now.getDate(),
			);
			const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1);
			const tomorrowStart = new Date(todayEnd.getTime() + 1);
			const tomorrowEnd = new Date(
				tomorrowStart.getTime() + 24 * 60 * 60 * 1000 - 1,
			);

			const dueClauses: Prisma.TaskWhereInput[] = [];

			if (dueDate.includes("today")) {
				dueClauses.push({
					dueDate: {
						gte: todayStart,
						lte: todayEnd,
					},
				});
			}
			if (dueDate.includes("tomorrow")) {
				dueClauses.push({
					dueDate: {
						gte: tomorrowStart,
						lte: tomorrowEnd,
					},
				});
			}
			if (dueDate.includes("overdue")) {
				dueClauses.push({
					dueDate: {
						lt: todayStart,
					},
				});
			}
			if (dueDate.includes("no-due-date")) {
				dueClauses.push({
					dueDate: null,
				});
			}

			if (dueClauses.length > 0) {
				whereClause.OR = dueClauses;
			}
		}

		if (search) {
			const searchClause: Prisma.TaskWhereInput = {
				OR: [
					{ title: { contains: search, mode: "insensitive" } },
					{ description: { contains: search, mode: "insensitive" } },
				],
			};
			if (whereClause.OR) {
				// Combine search clause and due date clauses using AND
				whereClause.AND = [{ OR: whereClause.OR }, searchClause];
				delete whereClause.OR;
			} else {
				whereClause.OR = searchClause.OR;
			}
		}

		const [tasks, total] = await Promise.all([
			prisma.task.findMany({
				where: whereClause,
				include: {
					user: {
						select: {
							id: true,
							email: true,
							name: true,
							role: true,
						},
					},
				},
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
		userId: string,
		data: {
			title?: string;
			description?: string | null;
			status?: string;
			priority?: string;
			dueDate?: Date | null;
		},
	) {
		const user = await prisma.user.findUnique({ where: { id: userId } });
		const userName = user?.name || "Unknown User";
		const userInitials =
			userName
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 1) || "U";

		const original = await prisma.task.findUnique({ where: { id } });
		if (!original) throw new Error("Task not found");

		const logsToCreate: { actionText: string }[] = [];

		if (data.title !== undefined && data.title !== original.title) {
			logsToCreate.push({
				actionText: `changed title from "${original.title}" to "${data.title}"`,
			});
		}
		if (data.status !== undefined && data.status !== original.status) {
			logsToCreate.push({
				actionText: `changed status from ${original.status} to ${data.status}`,
			});
		}
		if (data.priority !== undefined && data.priority !== original.priority) {
			logsToCreate.push({
				actionText: `changed priority from ${original.priority} to ${data.priority}`,
			});
		}
		if (data.dueDate !== undefined) {
			const origTime = original.dueDate?.getTime();
			const newTime = data.dueDate ? new Date(data.dueDate).getTime() : null;
			if (origTime !== newTime) {
				const dateString = data.dueDate
					? new Date(data.dueDate).toLocaleDateString()
					: "No due date";
				logsToCreate.push({ actionText: `changed due date to ${dateString}` });
			}
		}
		if (
			data.description !== undefined &&
			data.description !== original.description
		) {
			logsToCreate.push({ actionText: "updated description" });
		}

		return prisma.$transaction(async (tx) => {
			const updated = await tx.task.update({
				where: { id },
				data,
			});

			for (const log of logsToCreate) {
				await tx.activityLog.create({
					data: {
						taskId: id,
						userId,
						userName,
						userInitials,
						actionText: log.actionText,
					},
				});
			}

			return updated;
		});
	},

	async delete(id: string) {
		return prisma.task.delete({
			where: { id },
		});
	},
};
