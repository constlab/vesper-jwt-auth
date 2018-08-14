import { Entity, PrimaryColumn, Generated, Column, CreateDateColumn, Unique, Index } from "typeorm";

@Entity()
@Unique(["client", "token"])
export class Token {
	@PrimaryColumn()
	@Generated("uuid")
	id!: string;

	@Column({ comment: "user agent or other client id" })
	client!: string;

	@Column({ comment: "refresh token" })
	token!: string;

	@CreateDateColumn()
	createdAt!: Date;

	@Column()
	@Index()
	userId!: string;
}
