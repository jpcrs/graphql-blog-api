import { makeExecutableSchema } from 'graphql-tools';

const users: any[] = [
    {
        id: 1,
        name: 'João',
        email: 'joao@email.com'
    },
    {
        id: 2,
        name: 'Pedro',
        email: 'pedro@email.com'
    }
]

const typeDefs = `
    type User {
        id: ID!
        name: String!
        email: String!
    }

    type Query {
        allUsers: [User!]!
    }

    type Mutation {
        createUser(name: String!, email: String!) : User
    }
`;

const resolvers = {
    //Resolver trivial
    User: {
        id: (user /*parent*/) => user.id,
        name: (user /*parent*/) => user.name,
        email: (user /*parent*/) => user.email
    },
    Query: {
        allUsers: () => users
    },
    Mutation: {
        createUser: (parent, args, context, info) => {
            const newUser = Object.assign({id: users.length+1}, args);
            users.push(newUser);
            return newUser;
        } 
    }
}

export default makeExecutableSchema({typeDefs, resolvers});