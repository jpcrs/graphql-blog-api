import * as DataLoader from 'dataloader';
import { Dbconnection } from "../../Interfaces/DbConnectionInterface";
import { DataLoaders } from "../../Interfaces/DataLoadersInterface";
import { UserInstance } from '../../Models/UserModel';
import { UserLoader } from './UserLoader';
import { PostInstance } from '../../Models/PostModel';
import { PostLoader } from './PostLoader';

export class DataLoaderFactory {
    constructor(
        private db: Dbconnection
    ) {}

    getLoaders(): DataLoaders {
        return {
            userLoader: new DataLoader<number, UserInstance>(
                (ids: number[]) => UserLoader.batchUsers(this.db.User, ids)
            ),
            postLoader: new DataLoader<number, PostInstance>(
                (ids: number[]) => PostLoader.batchPosts(this.db.Post, ids)
            )
        }
    }
}