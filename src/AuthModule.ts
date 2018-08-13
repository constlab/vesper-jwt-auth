import { GraphModule } from "vesper";
import { AuthController } from "./AuthController";

interface IAuthConfig {
	refreshToken: {
		expiresIn: string;
	};
	accessToken: {
		expiresIn: string;
	};
}

export class AuthModule implements GraphModule {
	static config: IAuthConfig = {
		refreshToken: { expiresIn: "60d" },
		accessToken: { expiresIn: "30m" }
	};

	schemas = [__dirname + "/schema/*.gql"];
	controllers = [AuthController];
}
