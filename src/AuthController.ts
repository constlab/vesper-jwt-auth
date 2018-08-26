import { Request } from "express";
import { Inject } from "typedi";
import { Controller, CurrentRequest, Mutation } from "vesper";
import { AuthService, IAuthResult } from "./service/AuthService";

@Controller()
export class AuthController {
	@Inject()
	private auth!: AuthService;
	private userAgent: string = "";

	constructor(@Inject(() => CurrentRequest) private request: Request) {
		this.userAgent = (this.request.headers["user-agent"] as string) || "unknown user agent";
	}

	@Mutation({ name: "authLogin" })
	// @ArgsValidator(LoginArgsValidator)
	async login({ email, password }: { email: string; password: string }): Promise<IAuthResult> {
		return this.auth.sign(email, password, this.userAgent);
	}

	@Mutation({ name: "authRefresh" })
	async refresh({ token }: { token: string }): Promise<IAuthResult> {
		return await this.auth.refresh(this.userAgent, token);
	}
}
