import { IJWTPayload } from "./IJWTPayload";

export interface IUser {
	id: string | number;
	name?: string;
	email: string;
	password: string;
	role: string;
	jwtPayload: IJWTPayload | string;

	createdAt?: Date;
	updatedAt?: Date;

	checkPassword(password: string): boolean;
}
