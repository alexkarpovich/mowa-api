const { gql } = require('apollo-server-express');

const language = gql`
type Language {
    id: ID!
    name: String!
    nativeName: String!
    code: String!
}

type Query {
    languages: [Language]
}
`;

module.exports = language;
