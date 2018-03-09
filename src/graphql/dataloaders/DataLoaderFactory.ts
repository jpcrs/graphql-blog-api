import * as DataLoader from 'dataloader';
import { Dbconnection } from "../../Interfaces/DbConnectionInterface";
import { DataLoaders } from "../../Interfaces/DataLoadersInterface";
import { UserInstance } from '../../Models/UserModel';
import { UserLoader } from './UserLoader';
import { PostInstance } from '../../Models/PostModel';
import { PostLoader } from './PostLoader';
import { RequestedFields } from '../ast/RequestedFields';
import { DataLoaderParam } from '../../Interfaces/DataLoaderParamInterface';

export class DataLoaderFactory {
    constructor(
        private db: Dbconnection,
        private requestedFields: RequestedFields
    ) {}

    getLoaders(): DataLoaders {
        return {
            userLoader: new DataLoader<DataLoaderParam<number>, UserInstance>(
                (params: DataLoaderParam<number>[]) => UserLoader.batchUsers(this.db.User, params, this.requestedFields),
                { cacheKeyFn: (param: DataLoaderParam<number[]>) => param.key }
            ),
            postLoader: new DataLoader<DataLoaderParam<number>, PostInstance>(
                (params: DataLoaderParam<number>[]) => PostLoader.batchPosts(this.db.Post, params, this.requestedFields),
                { cacheKeyFn: (param: DataLoaderParam<number[]>) => param.key }
            )
        }
    }
}