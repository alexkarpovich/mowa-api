const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { mergeTypes, mergeResolvers, fileLoader } = require('merge-graphql-schemas');

const config = require('../config');
const neo4jdriver = require('./neo4j');

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, '../modules/*/typeDefs/*.js')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, '../modules/*/resolvers/*.js')));
const schemaDirectives = mergeResolvers(
    fileLoader(path.join(__dirname, '../apps/*/schemaDirectives/*.js'))
);

const schema = makeExecutableSchema({ typeDefs, resolvers, schemaDirectives });

module.exports = app => {
    const server = new ApolloServer({
        schema,
        context: ({req}) => ({
            driver: neo4jdriver,
            me: req.me,
        }),
    });

    server.applyMiddleware({ app, path: config.get('apollo:path') });
};
