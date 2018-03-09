import { GraphQLResolveInfo } from "graphql";
import { Dbconnection } from "../../../Interfaces/DbConnectionInterface";
import { Transaction } from "sequelize";
import { CommentInstance } from "../../../Models/CommentModel";
import { handleError } from "../../../utils/utils";
import { compose } from "../../composable/composable.resolver";
import { authResolvers } from "../../composable/auth.resolver";
import { AuthUser } from "../../../Interfaces/AuthUserInterface";
import { DataLoaders } from "../../../Interfaces/DataLoadersInterface";

export const commentResolvers = {
    Comment: {
        user: (comment, args, { db, dataloaders: { userLoader } }: {db: Dbconnection, dataloaders: DataLoaders}, info: GraphQLResolveInfo) => {
            // return db.User.findById(comment.get('user')).catch(handleError); -> without dataloader
            // return userLoader.load(comment.get('user')).catch(handleError); -> without AST
            return userLoader.load({key: comment.get('user'), info }).catch(handleError);
        },
        post: (comment, args, { db, dataloaders: { postLoader } }: {db: Dbconnection, dataloaders: DataLoaders}, info: GraphQLResolveInfo) => {
            // return db.Post.findById(comment.get('post')).catch(handleError); -> without dataloader
            // return postLoader.load(comment.get('post')).catch(handleError); -> without AST
            return postLoader.load({key: comment.get('post'), info }).catch(handleError);
        }
    },

    Query: {
        commentsByPost: (parent, {postId, first = 10, offset = 0}, { db }: {db: Dbconnection}, info: GraphQLResolveInfo) => {
            postId = parseInt(postId);
            return db.Comment.findAll({
                where: {post: postId},
                limit: first,
                offset
            }).catch(handleError);
        }
    },

    Mutation: {
        createComment: compose(...authResolvers)((parent, {input}, { db, authUser }: {db: Dbconnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
            input.user = authUser.id
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment.create(input, {transaction: t});
            }).catch(handleError);
        }),

        updateComment: compose(...authResolvers)((parent, {id, input}, { db, authUser }: {db: Dbconnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment.findById(id).then((comment: CommentInstance) => {
                    if(!comment) {
                        throw new Error (`Comment with id ${id} not found!`);
                    }
                    if(comment.get('user') != authUser.id) {
                        throw new Error ('Cannot edit comment from another users!')
                    }
                    input.user = authUser.id;
                    return comment.update(input, {transaction: t});
                })
            }).catch(handleError);
        }),

        deleteComment: compose(...authResolvers)((parent, {id}, { db, authUser }: {db: Dbconnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment.findById(id).then((comment: CommentInstance) => {
                    if(!comment) {
                        throw new Error (`Comment with id ${id} not found!`);
                    }
                    if(comment.get('user') != authUser.id) {
                        throw new Error ('Cannot delete comment from another users!')
                    }
                    return comment.destroy({transaction: t}).then(comment => !!comment);
                })
            }).catch(handleError);
        }),
    }
}