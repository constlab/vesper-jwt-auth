import { GraphModule } from "vesper";
import { PostController } from "./PostController";
import { Post } from "./Post";

export class PostModule implements GraphModule {
	schemas = [__dirname + "/schema/*.gql"];
	controllers = [PostController];
	entities = [Post];
}
