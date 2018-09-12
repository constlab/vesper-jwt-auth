import { getRepository } from "typeorm";
import { bootstrap } from "vesper";
import { AuthModule, jwtAuthorizationCheck } from "./../src/index";
import { PostModule } from "./post/PostModule";
import { User } from "./user/User";
import { UserModule } from "./user/UserModule";

const isProduction = process.env.NODE_ENV === "prod" || process.env.NODE_ENV === "production";

bootstrap({
	modules: [AuthModule, UserModule, PostModule],
	parameters: {
		salt: "MJ5DxHi3EKwzyyHveS9aoH3f2n7CRQ",
	},
	port: 3000,
	// tslint:disable-next-line:object-literal-sort-keys
	authorizationChecker: (roles: string[], action) => jwtAuthorizationCheck(roles, action),
	setupContainer: async (container) => {
		container.set("user.repository", getRepository(User));
	},
})
	.then((result) => {
		let status = `Your app is up and running on http://localhost:${result.options.port}.`;
		if (!isProduction) {
			status += `You can use Playground in development mode on http://localhost:${
				result.options.port
			}/playground`;
		}
		// tslint:disable-next-line:no-console
		console.log(status);
	})
	.catch((error) => {
		// tslint:disable-next-line:no-console
		console.error(error.stack ? error.stack : error);
	});
