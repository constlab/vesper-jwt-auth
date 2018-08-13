import { IJWTPayload } from "./IJWTPayload";

export interface IUser {
	id: string | number;
	name?: string;
	email: string;
	password: string;
	role: string;
	tokens: string | Array<{ agent: string; token: string; created: string }>;
	jwtPayload: IJWTPayload | string;

	createdAt?: Date;
	updatedAt?: Date;

	checkPassword(password: string): boolean;
}
