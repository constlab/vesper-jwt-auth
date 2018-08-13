import { GraphModule } from "vesper";
import { UserController } from "./UserController";
import { User } from "./User";

export class UserModule implements GraphModule {
	schemas = [__dirname + "/schema/*.gql"];
	controllers = [UserController];
	entities = [User];
}
