import { GraphQLResolveInfo } from "graphql";
import { Dbconnection } from "../../../Interfaces/DbConnectionInterface";
import { UserInstance } from "../../../Models/UserModel";
import { Transaction } from "sequelize";
import { userInfo } from "os";
import { handleError } from "../../../utils/utils";
import { compose } from "../../composable/composable.resolver";
import { authResolver, authResolvers } from "../../composable/auth.resolver";
import { verifyTokenResolver } from "../../composable/verify-troken.resolver";
import { AuthUser } from "../../../Interfaces/AuthUserInterface";
import { RequestedFields } from "../../ast/RequestedFields";
import { ResolverContext } from "../../../Interfaces/ResolverContextInterface";

export const userResolvers = {

    User: {
        posts: (user: UserInstance, { first = 10, offset = 0 }, { db, requestedFields }: {db: Dbconnection, requestedFields: RequestedFields}, info: GraphQLResolveInfo) => {
            return db.Post.findAll({
                where: {author: user.get('id')}, //get pois é do sequelize.
                limit: first,
                offset: offset,
                attributes: requestedFields.getFields(info, {keep: ['id'], exclude: ['comments']})
            }).catch(handleError);
        },
    },

    Query: {
        users: (parent, { first = 10, offset = 0 }, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.User.findAll({
                limit: first,
                offset: offset,
                attributes: context.requestedFields.getFields(info, {
                    keep: ['id'],
                    exclude: ['posts']
                }) 
            }).catch(handleError);
        },

        //Autenticando JWT
        user: compose(...authResolvers)((parent, { id }, context: ResolverContext, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return context.db.User.findById(id, {
                attributes: context.requestedFields.getFields(info, {
                    keep: ['id'],
                    exclude: ['posts']
                }) 
            })
            .then((user: UserInstance) => {
                if(!user) {
                    throw new Error(`User with id ${id} not found!`);
                }
                return user;
            }).catch(handleError);
        }),

        currentUser: compose(...authResolvers)((parent, {input}, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.User.findById(context.authUser.id, {
                attributes: context.requestedFields.getFields(info, {
                    keep: ['id'],
                    exclude: ['posts']
                }) 
            }).then((user: UserInstance) => {
                if(!user) {
                    throw new Error (`User with id ${context.authUser.id} not found!`);
                }
                return user;
            }).catch(handleError);
        }),
    },

    Mutation: {
        createUser: (parent, args, { db }: { db: Dbconnection }, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User.create(args.input, { transaction: t});
            }).catch(handleError);
        },

        //Autenticando JWT
        updateUser: compose(...authResolvers)((parent, {input}, { db, authUser }: {db: Dbconnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User.findById(authUser.id).then((user: UserInstance) => {
                    if(!user) {
                        throw new Error (`User with id ${authUser.id} not found!`);
                    }
                    return user.update(input, {transaction: t});
                });
            }).catch(handleError);
        }),

        //Autenticando JWT
        updateUserPassword: compose(...authResolvers)((parent, {input}, { db, authUser }: {db: Dbconnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User.findById(authUser.id).then((user: UserInstance) => {
                    if(!user) {
                        throw new Error (`User with id ${authUser.id} not found!`);
                    }
                    return user.update(input, {transaction: t}) //caso consiga atualizar o usuário, irá retornar o user para o callback.
                        .then((user: UserInstance) => !!user);
                });
            }).catch(handleError);
        }),

        deleteUser: compose(...authResolvers)((parent, args, { db, authUser }: {db: Dbconnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User.findById(authUser.id)
                    .then((user: UserInstance) => {
                        if(!user) {
                            throw new Error (`User with id ${authUser.id} not found!`);
                        }
                        return user.destroy({transaction: t}).then(user => !!user);
                    });
            }).catch(handleError);
        })
    }
};