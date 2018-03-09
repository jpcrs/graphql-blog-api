import { ComposableResolver } from "./composable.resolver";
import { ResolverContext } from "../../Interfaces/ResolverContextInterface";
import { GraphQLFieldResolver } from "graphql";
import { verifyTokenResolver } from "./verify-troken.resolver";

export const authResolver: ComposableResolver<any, ResolverContext> =
    (resolver: GraphQLFieldResolver<any, ResolverContext>): GraphQLFieldResolver<any, ResolverContext> => {
        return (parent, args, context, info) => {
            if (context.authUser || context.authorization) {
                return resolver(parent, args, context, info);
            }

            throw new Error(`Unauthorized! Token not provided!`);
        };
    };

export const authResolvers = [authResolver, verifyTokenResolver];