import { bootstrap } from "vesper";
import { AuthModule, jwtAuthorizationCheck } from "./../src/index";
import { PostModule } from "./post/PostModule";
import { getRepository } from "typeorm";
import { User } from "./user/User";
import { UserModule } from "./user/UserModule";

const isProduction = process.env.NODE_ENV === "prod" || process.env.NODE_ENV === "production";

bootstrap({
	port: 3000,
	modules: [AuthModule, UserModule, PostModule],
	parameters: {
		salt: "MJ5DxHi3EKwzyyHveS9aoH3f2n7CRQ"
	},
	setupContainer: async (container, action) => {
		container.set("user.repository", getRepository(User));
	},
	authorizationChecker: (roles: string[], action) => jwtAuthorizationCheck(roles, action)
})
	.then(result => {
		let status = `Your app is up and running on http://localhost:${result.options.port}.`;
		if (!isProduction) {
			status += `You can use Playground in development mode on http://localhost:${
				result.options.port
			}/playground`;
		}
		console.log(status);
	})
	.catch(error => {
		console.error(error.stack ? error.stack : error);
	});
