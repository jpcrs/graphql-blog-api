import { Dbconnection } from "../../../Interfaces/DbConnectionInterface";
import { GraphQLResolveInfo } from "graphql";
import { PostInstance } from "../../../Models/PostModel";
import { Transaction } from "sequelize";

export const postResolvers = {

    Post: {
        author: (post, args, { db }: {db: Dbconnection}, info: GraphQLResolveInfo) => {
            return db.User.findById(post.get('author'));
        },
        comments: (post, { first = 10, offset = 0 }, { db }: {db: Dbconnection}, info: GraphQLResolveInfo) => {
            return db.Comment.findAll({
                where: {post: post.get('id')},
                limit: first,
                offset: offset
            });
        }
    },

    Query: {
        posts: (parent, { first, offset }, { db }: {db: Dbconnection}, info: GraphQLResolveInfo) => {
            return db.Post.findAll({limit: first, offset: offset});
        },

        post: (parent, { id }, { db }: {db: Dbconnection}, info: GraphQLResolveInfo) => {
            return db.Post.findById(id)
                .then((post: PostInstance) => {
                    if(!post) {
                        throw new Error(`Post with id ${id} not found!`);
                    }
                    return post;
                });
        }
    },

    Mutation: {
        createPost: (post, { input }, { db }: {db: Dbconnection}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Post.create(input, {transaction: t});
            })
        },

        updatePost: (post, {id, input}, { db }: {db: Dbconnection}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.Post.findById(id)
                    .then((post: PostInstance) => {
                        if(!post) {
                            throw new Error (`Post with id ${id} not found!`);
                        }
                        return post.update(input, {transaction: t});
                    });
            });
        },

        deletePost: (post, {id}, { db }: {db: Dbconnection}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Post.findById(id)
                    .then((post: PostInstance) => {
                        return post.destroy({transaction: t}).then(post => !!post);
                    });
            });
        }
    }
};