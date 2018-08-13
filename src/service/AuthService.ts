import * as jwt from "jsonwebtoken";
import Container, { Service, Inject } from "typedi";
import { IUserRepository } from "../base/IUserRepository";
import { AuthModule } from "..";
import { IUser } from "../base/IUser";
import { IJWTPayload } from "../base/IJWTPayload";

interface IAuthResult {
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
		private config = AuthModule.config
	) {}

	/**
	 *Sign In
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

		let storedTokenIndex: number = -1;
		let storedToken: { agent: string; token: string; created: string } | null = null;

		if (Array.isArray(user.tokens)) {
			user.tokens.forEach((item, index) => {
				if (item.agent === userAgent && item.token === token) {
					storedToken = item;
					storedTokenIndex = index;
				}
			});
		}
		if (storedToken === null) {
			throw new Error("Bad token");
		}

		const refreshToken = jwt.sign({ id: user.id }, this.salt, {
			expiresIn: this.config.refreshToken.expiresIn
		});
		const accessToken = jwt.sign({ id: user.id, name: user.name, role: user.role }, this.salt, {
			expiresIn: this.config.accessToken.expiresIn
		});

		if (Array.isArray(user.tokens)) {
			user.tokens[storedTokenIndex] = {
				agent: userAgent,
				token: refreshToken,
				created: new Date().toString()
			};
			await this.userRepository.save(user);
		}

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
	 * @returns {Promise<IUser>}
	 * @memberof AuthService
	 */
	async saveToken(user: IUser, userAgent: string, refreshToken: string): Promise<IUser> {
		const newTokenItem = {
			agent: userAgent,
			token: refreshToken,
			created: new Date().toString()
		};
		if (!Array.isArray(user.tokens)) {
			user.tokens = new Array();
			user.tokens.push(newTokenItem);
		} else {
			let storedTokenIndex: number = -1;
			user.tokens.forEach((item, index) => {
				if (item.agent === userAgent) {
					storedTokenIndex = index;
				}
			});
			if (storedTokenIndex > -1) {
				user.tokens[storedTokenIndex] = newTokenItem;
			} else {
				user.tokens.push(newTokenItem);
			}
		}

		return await this.userRepository.save(user);
	}
}
