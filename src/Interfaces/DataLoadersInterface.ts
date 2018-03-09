import * as DataLoader from 'dataloader';
import { UserInstance } from '../Models/UserModel';
import { PostInstance } from '../Models/PostModel';
import { DataLoaderParam } from './DataLoaderParamInterface';

export interface DataLoaders {
    userLoader: DataLoader<DataLoaderParam<number>, UserInstance>;
    postLoader: DataLoader<DataLoaderParam<number>, PostInstance>;
}