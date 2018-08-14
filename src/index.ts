import * as jwt from "jsonwebtoken";
import Container from "typedi";
import { Action } from "vesper";
import { IJWTPayload } from "./base/IJWTPayload";

export * from "./AuthModule";
export * from "./AuthController";
export * from "./service/AuthService";
export * from "./base/User";

export function jwtAuthorizationCheck(roles: string[], action: Action): void {
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
}
