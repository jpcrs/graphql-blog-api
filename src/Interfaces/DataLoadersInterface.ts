import * as DataLoader from 'dataloader';
import { UserInstance } from '../Models/UserModel';
import { PostInstance } from '../Models/PostModel';

export interface DataLoaders {
    userLoader: DataLoader<number, UserInstance>;
    postLoader: DataLoader<number, PostInstance>;
}