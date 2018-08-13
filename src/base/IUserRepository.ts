import { Repository } from "typeorm";
import { IUser } from "./IUser";

export interface IUserRepository extends Repository<IUser> {}
