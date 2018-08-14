import * as jwt from "jsonwebtoken";
import Container from "typedi";
import { Action } from "vesper";
import { IJWTPayload } from "./base/IJWTPayload";
import { IUserRepository } from "./base/IUserRepository";

export * from "./AuthModule";
export * from "./AuthController";
export * from "./service/AuthService";
export * from "./base/User";

/**
 * - JWT authorization check
 * - Check for access by role
 * - Set current user to DI
 *
 * @export
 * @param {string[]} roles
 * @param {Action} action
 * @returns {Promise<void>}
 */
export async function jwtAuthorizationCheck(roles: string[], action: Action): Promise<void> {
	if (action.request === undefined) {
		throw new Error("Request must be provided");
	}
	const token: string = (action.request.headers["token"] as string) || "";
	if (token === "") {
		throw new Error("The token not provided");
	}

	const payload: IJWTPayload | any = jwt.verify(token, Container.get("salt"));

	if (roles.length && !roles.includes(payload["role"])) {
		throw new Error("Access denied");
	}

	const repository = action.container.get<IUserRepository>("user.repository");
	const user = await repository.findOneOrFail(payload.id || String(payload));
	action.container.set("user.current", user);
}
