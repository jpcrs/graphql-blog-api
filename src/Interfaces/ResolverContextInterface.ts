import { Dbconnection } from "./DbConnectionInterface";
import { AuthUser } from "./AuthUserInterface";

export interface ResolverContext {
    db?: Dbconnection;
    authorization?: string;
    authUser?: AuthUser;
}