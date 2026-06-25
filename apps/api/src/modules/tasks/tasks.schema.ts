import { z } from "zod";

export const taskStatusEnum = z.enum([
	"backlog",
	"todo",
	"in-progress",
	"done",
	"canceled",
]);
export const taskPriorityEnum = z.enum([
	"urgent",
	"high",
	"medium",
	"low",
	"no-priority",
]);

export const taskIdParamsSchema = z.object({
	id: z.string().refine((val) => {
		const isUuid =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
				val,
			);
		const isStrId = /^OPH-\d+$/i.test(val);
		const isStrUuidPrefix = /^OPH-[0-9a-f]{8}$/i.test(val);
		return isUuid || isStrId || isStrUuidPrefix;
	}, "Invalid task ID or code format"),
});

export const createTaskSchema = z.object({
	id: z.string().uuid().optional(),
	title: z.string().min(1, "Title must not be empty").max(255),
	description: z.string().optional().nullable(),
	status: taskStatusEnum.default("todo"),
	priority: taskPriorityEnum.default("no-priority"),
	dueDate: z.preprocess(
		(val) => (val === "" || val === null ? null : val),
		z.coerce.date().optional().nullable(),
	),
});

export const updateTaskSchema = z.object({
	title: z.string().min(1, "Title must not be empty").max(255).optional(),
	description: z.string().optional().nullable(),
	status: taskStatusEnum.optional(),
	priority: taskPriorityEnum.optional(),
	dueDate: z
		.preprocess(
			(val) => (val === "" || val === null ? null : val),
			z.coerce.date().optional().nullable(),
		)
		.optional(),
});

export const listTasksQuerySchema = z.object({
	status: z
		.string()
		.optional()
		.transform((val) => (val ? val.split(",") : undefined))
		.pipe(z.array(taskStatusEnum).optional()),
	priority: z
		.string()
		.optional()
		.transform((val) => (val ? val.split(",") : undefined))
		.pipe(z.array(taskPriorityEnum).optional()),
	dueDate: z
		.string()
		.optional()
		.transform((val) => (val ? val.split(",") : undefined))
		.pipe(
			z
				.array(z.enum(["today", "tomorrow", "overdue", "no-due-date"]))
				.optional(),
		),
	search: z.string().optional(),
	sortBy: z.enum(["createdAt", "dueDate", "priority"]).default("createdAt"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
	page: z
		.string()
		.optional()
		.default("1")
		.transform((val) => {
			const parsed = parseInt(val, 10);
			return Number.isNaN(parsed) ? 1 : Math.max(1, parsed);
		})
		.pipe(z.number()),
	limit: z
		.string()
		.optional()
		.default("25")
		.transform((val) => {
			const parsed = parseInt(val, 10);
			return Number.isNaN(parsed) ? 25 : Math.min(100, Math.max(1, parsed));
		})
		.pipe(z.number()),
	allUsers: z
		.string()
		.optional()
		.transform((val) => (val === undefined ? undefined : val === "true"))
		.pipe(z.boolean().optional()),
});
