import { ResolverContext } from "../../Interfaces/ResolverContextInterface";
import { ComposableResolver } from "./composable.resolver";
import { GraphQLFieldResolver } from "graphql";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../../utils/utils";

export const verifyTokenResolver: ComposableResolver<any, ResolverContext> =
    (resolver: GraphQLFieldResolver<any, ResolverContext>): GraphQLFieldResolver<any, ResolverContext> => {
        return (parent, args, context: ResolverContext, info) => {
            const token: string = context.authorization ? context.authorization.split(' ')[1] : undefined

            jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
                if (!err) {
                    resolver(parent, args, context, info);
                }

                throw new Error(`${err.name}: ${err.message}`);
            })
        }
    }