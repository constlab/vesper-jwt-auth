import * as bcrypt from "bcryptjs";
import { IsDefined, IsEmail } from "class-validator";
import {
	BeforeInsert,
	Column,
	CreateDateColumn,
	Generated,
	PrimaryColumn,
	UpdateDateColumn,
} from "typeorm";
import { IJWTPayload } from "./IJWTPayload";
import { IUser } from "./IUser";

export abstract class User implements IUser {
	get jwtPayload(): IJWTPayload {
		return {
			id: this.id,
			role: this.role,
		};
	}

	@PrimaryColumn()
	@Generated("uuid")
	id!: string;

	@Column({ unique: true })
	@IsDefined()
	@IsEmail()
	email!: string;

	@Column({ nullable: true })
	name!: string;

	@Column({ default: "user", length: 50 })
	role!: string;

	@CreateDateColumn()
	createdAt?: Date;

	@UpdateDateColumn()
	updatedAt!: Date;

	@Column({ name: "password" })
	// tslint:disable-next-line:variable-name
	protected _password!: string;

	set password(password: string) {
		this._password = bcrypt.hashSync(password.trim(), bcrypt.genSaltSync(10));
	}

	@BeforeInsert()
	updateName(): void {
		let name = this.email.split("@")[0];
		name = name.charAt(0).toUpperCase() + name.slice(1);

		this.name = name;
	}

	checkPassword(password: string): boolean {
		return bcrypt.compareSync(password, this._password);
	}
}
