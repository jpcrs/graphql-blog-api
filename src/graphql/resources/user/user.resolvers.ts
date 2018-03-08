import { GraphQLResolveInfo } from "graphql";
import { Dbconnection } from "../../../Interfaces/DbConnectionInterface";
import { UserInstance } from "../../../Models/UserModel";
import { Transaction } from "sequelize";
import { userInfo } from "os";

export const userResolvers = {

    User: {
        posts: (user: UserInstance, { first = 10, offset = 0 }, { db }: {db: Dbconnection}, info: GraphQLResolveInfo) => {
            return db.Post.findAll({
                where: {author: user.get('id')}, //get pois é do sequelize.
                limit: first,
                offset: offset
            })
        },
    },

    Query: {
        users: (parent, { first = 10, offset = 0 }, { db }: {db: Dbconnection}, info: GraphQLResolveInfo) => {
            return db.User.findAll({
                limit: first,
                offset: offset
            });
        },

        user: (parent, args, { db }: {db: Dbconnection}, info: GraphQLResolveInfo) => {
            return db.User.findById(args.id)
            .then((user: UserInstance) => {
                if(!user) {
                    throw new Error(`User with id ${args.id} not found!`);
                }
                return user;
            });
        }
    },

    Mutation: {
        createUser: (parent, args, { db }: {db: Dbconnection}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User.create(args.input, { transaction: t});
            });
        },

        updateUser: (parent, {id, input}, { db }: {db: Dbconnection}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.User.findById(id).then((user: UserInstance) => {
                    if(!user) {
                        throw new Error (`User with id ${id} not found!`);
                    }
                    return user.update(input, {transaction: t});
                });
            });
        },

        updateUserPassword: (parent, {id, input}, { db }: {db: Dbconnection}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.User.findById(id).then((user: UserInstance) => {
                    if(!user) {
                        throw new Error (`User with id ${id} not found!`);
                    }
                    return user.update(input, {transaction: t}) //caso consiga atualizar o usuário, irá retornar o user para o callback.
                        .then((user: UserInstance) => !!user);
                });
            });
        },

        deleteUser: (parent, {id}, { db }: {db: Dbconnection}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.User.findById(id)
                    .then((user: UserInstance) => {
                        if(!user) {
                            throw new Error (`User with id ${id} not found!`);
                        }
                        return user.destroy({transaction: t}).then(user => !!user);
                    });
            });
        }
    }
};