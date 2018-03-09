import { PostModel, PostInstance } from "../../Models/PostModel";

export class PostLoader {
    static batchPosts(Post: PostModel, ids: number[]): Promise<PostInstance[]> {
        return Promise.resolve(
            Post.findAll({
                where: { id: { $in: ids } }
            })
        );
    }
}