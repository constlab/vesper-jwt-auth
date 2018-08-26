import { Column, Entity, Generated, PrimaryColumn } from "typeorm";

@Entity()
export class Post {
	@PrimaryColumn()
	@Generated("uuid")
	id!: string;

	@Column()
	title!: string;
}
