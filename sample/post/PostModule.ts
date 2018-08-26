import { GraphModule } from "vesper";
import { Post } from "./Post";
import { PostController } from "./PostController";

export class PostModule implements GraphModule {
	schemas = [__dirname + "/schema/*.gql"];
	controllers = [PostController];
	entities = [Post];
}
