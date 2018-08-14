import * as jwt from "jsonwebtoken";
import Container, { Service, Inject } from "typedi";
import { IUserRepository } from "../base/IUserRepository";
import { AuthModule } from "..";
import { IUser } from "../base/IUser";
import { IJWTPayload } from "../base/IJWTPayload";
import { Token } from "../model/Token";
import { EntityManager, DeleteResult } from "typeorm";

export interface IAuthResult {
	accessToken: string;
	refreshToken: string;
	user: IUser;
}

@Service()
export class AuthService {
	@Inject("user.repository")
	private userRepository!: IUserRepository;

	constructor(
		private salt: string = Container.get<string>("salt"),
		private config = AuthModule.config,
		private entityManager: EntityManager
	) {}

	/**
	 * Sign In
	 *
	 * @param {string} email
	 * @param {string} password
	 * @param {string} [userAgent=""]
	 * @returns {Promise<IAuthResult>}
	 * @memberof AuthService
	 */
	async sign(email: string, password: string, userAgent: string = ""): Promise<IAuthResult> {
		const user: IUser = await this.userRepository.findOneOrFail({ email });
		if (!user.checkPassword(password)) {
			throw new Error("Wrong password");
		}
		const refreshToken = jwt.sign({ id: user.id }, this.salt, {
			expiresIn: this.config.refreshToken.expiresIn
		});
		const accessToken = jwt.sign(user.jwtPayload, this.salt, {
			expiresIn: this.config.accessToken.expiresIn
		});

		await this.saveToken(user, userAgent, refreshToken);

		return {
			accessToken,
			refreshToken,
			user
		};
	}

	/**
	 * Get Access Token by Refresh Token
	 *
	 * @param {string} userAgent
	 * @param {string} token
	 * @returns {Promise<IAuthResult>}
	 * @memberof AuthService
	 */
	async refresh(userAgent: string, token: string): Promise<IAuthResult> {
		const payload: IJWTPayload | string | any = await jwt.verify(token, this.salt);
		const userId = typeof payload === "string" ? payload : payload.id;
		const user = await this.userRepository.findOneOrFail({
			id: userId
		});

		const storedToken = await this.entityManager.findOne(Token, {
			where: {
				userId,
				token,
				client: userAgent
			}
		});
		if (storedToken === null) {
			throw new Error("Bad refresh token");
		}

		const refreshToken = jwt.sign({ id: user.id }, this.salt, {
			expiresIn: this.config.refreshToken.expiresIn
		});
		const accessToken = jwt.sign({ id: user.id, name: user.name, role: user.role }, this.salt, {
			expiresIn: this.config.accessToken.expiresIn
		});

		await this.saveToken(user, userAgent, refreshToken);

		return {
			accessToken,
			refreshToken,
			user
		};
	}

	/**
	 * Save token to user
	 *
	 * @param {IUser} user
	 * @param {string} userAgent
	 * @param {string} refreshToken
	 * @returns {Promise<Token>}
	 * @memberof AuthService
	 */
	async saveToken(user: IUser, userAgent: string, refreshToken: string): Promise<Token> {
		const tokensCount: number = await this.entityManager.count(Token, {
			where: { userId: user.id.toString() }
		});
		if (tokensCount + 1 >= this.config.refreshToken.maxSavedTokens) {
			await this.clearAllTokens(user);
		} else {
			await this.entityManager.delete(Token, {
				client: userAgent,
				userId: user.id.toString()
			});
		}

		const newToken = new Token();
		newToken.client = userAgent;
		newToken.token = refreshToken;
		newToken.userId = user.id.toString();

		return await this.entityManager.save(Token, newToken);
	}

	/**
	 * Delete all saved refresh tokenss
	 *
	 * @param {IUser} user
	 * @returns {Promise<DeleteResult>}
	 * @memberof AuthService
	 */
	async clearAllTokens(user: IUser): Promise<DeleteResult> {
		return await this.entityManager.delete(Token, {
			userId: user.id.toString()
		});
	}
}
