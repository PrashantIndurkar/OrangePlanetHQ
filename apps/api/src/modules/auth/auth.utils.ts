import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

export const hashPassword = async (password: string): Promise<string> => {
	return bcrypt.hash(password, 10);
};

export const comparePassword = async (
	password: string,
	hash: string,
): Promise<boolean> => {
	return bcrypt.compare(password, hash);
};

export const generateToken = (payload: object): string => {
	return jwt.sign(payload, env.JWT_SECRET, {
		expiresIn: "7d",
	});
};

// biome-ignore lint/suspicious/noExplicitAny: verifyToken returns a decoded JWT payload
export const verifyToken = (token: string): any => {
	return jwt.verify(token, env.JWT_SECRET);
};
