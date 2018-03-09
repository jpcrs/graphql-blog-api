import { Dbconnection } from "./DbConnectionInterface";
import { AuthUser } from "./AuthUserInterface";
import { DataLoaders } from "./DataLoadersInterface";
import { RequestedFields } from "../graphql/ast/RequestedFields";

export interface ResolverContext {
    db?: Dbconnection;
    authorization?: string;
    authUser?: AuthUser;
    dataloaders?: DataLoaders;
    requestedFields?: RequestedFields;
}