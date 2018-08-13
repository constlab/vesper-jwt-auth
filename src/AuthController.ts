import { Controller, CurrentRequest, Mutation, ArgsValidator } from "vesper";
import { Inject } from "typedi";
import { AuthService, IAuthResult } from "./service/AuthService";
import { Request } from "express";

@Controller()
export class AuthController {
	@Inject()
	private auth!: AuthService;
	private userAgent: string = "";

	constructor(@Inject(type => CurrentRequest) private request: Request) {
		this.userAgent = (this.request.headers["user-agent"] as string) || "unknown user agent";
	}

	@Mutation({ name: "authLogin" })
	//@ArgsValidator(LoginArgsValidator)
	async login({ email, password }: { email: string; password: string }): Promise<IAuthResult> {
		return this.auth.sign(email, password, this.userAgent);
	}

	@Mutation({ name: "authRefresh" })
	async refresh({ token }: { token: string }): Promise<IAuthResult> {
		return await this.auth.refresh(this.userAgent, token);
	}
}
