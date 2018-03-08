import { GraphQLResolveInfo } from "graphql";
import { Dbconnection } from "../../../Interfaces/DbConnectionInterface";
import { UserInstance } from "../../../Models/UserModel";
import { Transaction } from "sequelize";
import { userInfo } from "os";

export const userResolvers = {
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

    Mutations: {
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
    }
};