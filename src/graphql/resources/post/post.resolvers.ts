import * as graphqlFields from 'graphql-fields';
import { Dbconnection } from "../../../Interfaces/DbConnectionInterface";
import { GraphQLResolveInfo } from "graphql";
import { PostInstance } from "../../../Models/PostModel";
import { Transaction } from "sequelize";
import { handleError } from "../../../utils/utils";
import { authResolvers } from "../../composable/auth.resolver";
import { compose } from "../../composable/composable.resolver";
import { AuthUser } from "../../../Interfaces/AuthUserInterface";
import { DataLoaders } from "../../../Interfaces/DataLoadersInterface";

export const postResolvers = {

    Post: {
        author: (post, args, { db, dataloaders: { userLoader } }: {db: Dbconnection, dataloaders: DataLoaders}, info: GraphQLResolveInfo) => {
            // return db.User.findById(post.get('author')); -> without dataloader
            // return userLoader.load(post.get('author')).catch(handleError); -> without AST
            return userLoader.load({key: post.get('author'), info }).catch(handleError);
        },
        comments: (post, { first = 10, offset = 0 }, { db }: {db: Dbconnection}, info: GraphQLResolveInfo) => {
            return db.Comment.findAll({
                where: {post: post.get('id')},
                limit: first,
                offset: offset
            }).catch(handleError);
        }
    },

    Query: {
        posts: (parent, { first, offset }, { db }: {db: Dbconnection}, info: GraphQLResolveInfo) => {
            return db.Post.findAll({
                limit: first,
                offset: offset,
                attributes: []
            });
        },

        post: (parent, { id }, { db }: {db: Dbconnection}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.Post.findById(id)
                .then((post: PostInstance) => {
                    if(!post) {
                        throw new Error(`Post with id ${id} not found!`);
                    }
                    return post;
                }).catch(handleError);
        }
    },

    Mutation: {
        createPost: compose(...authResolvers)((post, { input }, { db, authUser }: {db: Dbconnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
            input.author = authUser.id;
            return db.sequelize.transaction((t: Transaction) => {
                return db.Post.create(input, {transaction: t});
            }).catch(handleError);
        }),

        updatePost: compose(...authResolvers)((post, {id, input}, { db, authUser }: {db: Dbconnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.Post.findById(id)
                    .then((post: PostInstance) => {
                        if(!post) {
                            throw new Error (`Post with id ${id} not found!`);
                        }
                        if(post.get('author') != authUser.id) {
                            throw new Error ('Cannot edit posts from another users!')
                        }
                        input.author = authUser.id;
                        return post.update(input, {transaction: t});
                    });
            }).catch(handleError);
        }),

        deletePost: compose(...authResolvers)((post, {id}, { db, authUser }: {db: Dbconnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Post.findById(id)
                    .then((post: PostInstance) => {
                        if(!post) {
                            throw new Error (`Post with id ${id} not found!`);
                        }
                        if(post.get('author') != authUser.id) {
                            throw new Error ('Cannot delete posts from another users!')
                        }
                        return post.destroy({transaction: t}).then(post => !!post);
                    });
            }).catch(handleError);
        })
    }
};