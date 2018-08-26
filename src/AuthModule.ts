import { GraphModule } from "vesper";
import { AuthController } from "./AuthController";
import { Token } from "./model/Token";
import { TokenController } from "./TokenController";

export interface IAuthConfig {
	refreshToken: {
		expiresIn: string;
		maxSavedTokens: number;
	};
	accessToken: {
		expiresIn: string;
	};
}

export class AuthModule implements GraphModule {
	static config: IAuthConfig = {
		accessToken: { expiresIn: "30m" },
		refreshToken: { expiresIn: "60d", maxSavedTokens: 10 },
	};

	schemas = [__dirname + "/schema/*.gql"];
	controllers = [AuthController, TokenController];
	entities = [Token];
}
