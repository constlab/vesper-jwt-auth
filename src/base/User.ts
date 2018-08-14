import * as bcrypt from "bcryptjs";
import { IUser } from "./IUser";
import {
	PrimaryColumn,
	Generated,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	BeforeInsert
} from "typeorm";
import { IsEmail, IsDefined } from "class-validator";
import { IJWTPayload } from "./IJWTPayload";

export abstract class User implements IUser {
	@PrimaryColumn()
	@Generated("uuid")
	id!: string;

	@Column({ unique: true })
	@IsDefined()
	@IsEmail()
	email!: string;

	@Column({ nullable: true })
	name!: string;

	@Column({ name: "password" })
	protected _password!: string;

	set password(password: string) {
		this._password = bcrypt.hashSync(password.trim(), bcrypt.genSaltSync(10));
	}

	@Column({ default: "user", length: 50 })
	role!: string;

	get jwtPayload(): IJWTPayload {
		return {
			id: this.id,
			role: this.role
		};
	}

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;

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
