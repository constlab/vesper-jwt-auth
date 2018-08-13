import { Entity } from "typeorm";
import { User as BaseUser } from "../../src";
import { IJWTPayload } from "../../src/base/IJWTPayload";

@Entity()
export class User extends BaseUser {
	get jwtPayload(): IJWTPayload {
		return {
			id: this.id,
			email: this.email
		};
	}
}
