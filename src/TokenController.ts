import { Controller, Query, Authorized, Mutation } from "vesper";
import { EntityManager } from "typeorm";

@Controller()
export class TokenController {
	constructor(private entityManager: EntityManager) {}

	@Query({ name: "tokens" })
	@Authorized()
	async index() {}

	@Mutation({ name: "tokenDelete" })
	@Authorized()
	async delete() {}

	@Mutation({ name: "tokensDelete" })
	@Authorized()
	async deleteByIds() {}
}
