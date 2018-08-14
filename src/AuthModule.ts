import { GraphModule } from "vesper";
import { AuthController } from "./AuthController";
import { Token } from "./model/Token";

interface IAuthConfig {
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
		refreshToken: { expiresIn: "60d", maxSavedTokens: 10 },
		accessToken: { expiresIn: "30m" }
	};

	schemas = [__dirname + "/schema/*.gql"];
	controllers = [AuthController];
	entities = [Token];
}
