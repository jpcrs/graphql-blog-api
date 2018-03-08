import { UserModel } from "../Models/UserModel";
import { PostModel } from "../Models/PostModel";
import { CommentModel } from "../Models/CommentModel";

export interface ModelsInterface {
    User: UserModel;
    Post: PostModel;
    Comment: CommentModel;
}