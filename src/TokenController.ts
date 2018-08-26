import { Inject } from "typedi";
import { EntityManager } from "typeorm";
import { Authorized, Controller, Mutation, Query } from "vesper";
import { IUser } from "./base/IUser";
import { Token } from "./model/Token";

@Controller()
export class TokenController {
	@Inject("user.current")
	user: IUser | null = null;

	constructor(private entityManager: EntityManager) {}

	@Query({ name: "tokens" })
	@Authorized()
	async index(): Promise<Token[]> {
		if (this.user === null) {
			throw new Error("Current user must be provided");
		}
		return await this.entityManager.find(Token, { where: { userId: this.user.id } });
	}

	@Mutation({ name: "tokenDelete" })
	@Authorized()
	async delete({ id }: { id: string }) {
		if (this.user === null) {
			throw new Error("Current user must be provided");
		}

		return await this.entityManager.delete(Token, {
			id,
			userId: this.user.id.toString(),
		});
	}

	@Mutation({ name: "tokensDelete" })
	@Authorized()
	async deleteByIds({ ids }: { ids: string[] }) {
		if (this.user === null) {
			throw new Error("Current user must be provided");
		}
	}
}
