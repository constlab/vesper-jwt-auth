import { Entity, PrimaryColumn, Generated, Column } from "typeorm";

@Entity()
export class Post {
	@PrimaryColumn()
	@Generated("uuid")
	id!: string;

	@Column()
	title!: string;
}
