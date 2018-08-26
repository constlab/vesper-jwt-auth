import { validate } from "class-validator";
import { EntityManager } from "typeorm";
import { Controller, Mutation } from "vesper";
import { User } from "./User";

@Controller()
export class UserController {
	constructor(private userRepository: EntityManager) {}

	@Mutation({ name: "userCreate" })
	async create({ email, password }: { email: string; password: string }): Promise<User> {
		const user = new User();
		user.email = email;
		user.password = password;

		const errors = await validate(user);
		if (errors.length > 0) {
			throw errors;
		}

		return await this.userRepository.save(User, user);
	}
}
