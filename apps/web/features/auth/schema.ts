import { z } from "zod";

export const loginSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address"),
	password: z
		.string()
		.min(1, "Password is required")
		.min(6, "Password must be at least 6 characters"),
	rememberMe: z.boolean().optional(),
});

export const signupSchema = z
	.object({
		name: z
			.string()
			.min(1, "Name is required")
			.min(2, "Name must be at least 2 characters"),
		email: z
			.string()
			.min(1, "Email is required")
			.email("Please enter a valid email address"),
		password: z
			.string()
			.min(1, "Password is required")
			.min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string().min(1, "Confirm password is required"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export function createResolver<T extends z.ZodTypeAny>(schema: T) {
	return async (values: any) => {
		const result = await schema.safeParseAsync(values);
		if (result.success) {
			return { values: result.data, errors: {} };
		}

		const errors = result.error.issues.reduce((acc: any, current: any) => {
			const path = current.path.join(".");
			acc[path] = {
				type: current.code,
				message: current.message,
			};
			return acc;
		}, {});

		return { values: {}, errors };
	};
}
