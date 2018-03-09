import { Dbconnection } from "./DbConnectionInterface";
import { AuthUser } from "./AuthUserInterface";
import { DataLoaders } from "./DataLoadersInterface";

export interface ResolverContext {
    db?: Dbconnection;
    authorization?: string;
    authUser?: AuthUser;
    dataloaders?: DataLoaders;
}