export interface BackendTask {
	id: string;
	issueNumber: number;
	title: string;
	description: string | null;
	status: string;
	priority: string;
	dueDate: string | null;
	userId: string;
	createdAt: string;
	updatedAt: string;
	user?: {
		id: string;
		name: string | null;
		email: string;
	} | null;
	activities?: BackendActivityLog[];
}

export interface BackendActivityLog {
	id: string;
	taskId: string;
	userId: string;
	userName: string;
	userInitials: string;
	actionText: string;
	timestamp: string;
}

export interface ListTasksResponse {
	tasks: BackendTask[];
	total: number;
}

export interface TaskResponse {
	task: BackendTask;
}

export interface CreateTaskInput {
	id?: string;
	title: string;
	description?: string;
	status?: string;
	priority?: string;
	dueDate?: string | null;
}

export interface UpdateTaskInput {
	title?: string;
	description?: string | null;
	status?: string;
	priority?: string;
	dueDate?: string | null;
}
