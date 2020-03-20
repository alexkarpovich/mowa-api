const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { mergeTypes, mergeResolvers } = require('merge-graphql-schemas');

const config = require('../config');
const neo4jdriver = require('./neo4j');

const languageType = require('../modules/language/typeDefs/language.schema');
const profileType = require('../modules/profile/typeDefs/profile.schema');
const setType = require('../modules/set/typeDefs/set.schema');
const termType = require('../modules/term/typeDefs/term.schema');
const trainingType = require('../modules/training/typeDefs/training.schema');
const translationType = require('../modules/translation/typeDefs/translation.schema');
const userType = require('../modules/user/typeDefs/user.schema');

const languageResolver = require('../modules/language/resolvers/language.resolver');
const profileResolver = require('../modules/profile/resolvers/profile.resolver');
const setResolver = require('../modules/set/resolvers/set.resolver');
const termResolver = require('../modules/term/resolvers/term.resolver');
const trainingResolver = require('../modules/training/resolvers/training.resolver');
const userResolver = require('../modules/user/resolvers/user.resolver');

const typeDefs = mergeTypes([
  languageType,
  profileType,
  setType,
  termType,
  trainingType,
  translationType,
  userType,
]);
const resolvers = mergeResolvers([
  languageResolver,
  profileResolver,
  setResolver,
  termResolver,
  trainingResolver,
  userResolver,
]);
const schemaDirectives = mergeResolvers([]);

const schema = makeExecutableSchema({ typeDefs, resolvers, schemaDirectives });

module.exports = app => {
    const server = new ApolloServer({
        schema,
        context: ({req}) => ({
            driver: neo4jdriver,
            mq: app.mq,
            me: req.me,
        }),
    });

    server.applyMiddleware({ app, path: config.get('apollo:path') });
};
