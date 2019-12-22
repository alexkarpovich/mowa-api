const LanguagesQuery = require('../queries/languages.query');

const resolvers = {
    Query: {
        languages: (parent, args, context, info) =>
          LanguagesQuery.exec({ parent, args, context, info }),
    }
};

module.exports = resolvers;
