import { Controller, CurrentRequest, Mutation, ArgsValidator } from "vesper";
import { Inject } from "typedi";
import { AuthService } from "./service/AuthService";
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
	async login(args: any): Promise<any> {
		return this.auth.sign(args.email, args.password, this.userAgent);
	}
}
