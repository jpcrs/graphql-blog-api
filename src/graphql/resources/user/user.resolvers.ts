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

export const userResolvers = {

    User: {
        posts: (user: UserInstance, { first = 10, offset = 0 }, { db }: {db: Dbconnection}, info: GraphQLResolveInfo) => {
            return db.Post.findAll({
                where: {author: user.get('id')}, //get pois é do sequelize.
                limit: first,
                offset: offset
            }).catch(handleError);
        },
    },

    Query: {
        users: (parent, { first = 10, offset = 0 }, { db }: {db: Dbconnection}, info: GraphQLResolveInfo) => {
            return db.User.findAll({
                limit: first,
                offset: offset
            }).catch(handleError);
        },

        //Autenticando JWT
        user: compose(...authResolvers)((parent, { id }, { db }: {db: Dbconnection}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.User.findById(id)
            .then((user: UserInstance) => {
                if(!user) {
                    throw new Error(`User with id ${id} not found!`);
                }
                return user;
            }).catch(handleError);
        }),

        currentUser: compose(...authResolvers)((parent, {input}, { db, authUser }: {db: Dbconnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
            return db.User.findById(authUser.id).then((user: UserInstance) => {
                if(!user) {
                    throw new Error (`User with id ${authUser.id} not found!`);
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