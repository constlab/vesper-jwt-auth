import { GraphModule } from "vesper";
import { User } from "./User";
import { UserController } from "./UserController";

export class UserModule implements GraphModule {
	schemas = [__dirname + "/schema/*.gql"];
	controllers = [UserController];
	entities = [User];
}
