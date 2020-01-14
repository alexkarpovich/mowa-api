const { gql } = require('apollo-server-express');

module.exports = gql`
  type Term {
    id: ID!
    value: String!
    translations: [Translation!]
    transcriptions: [String!]
  }
`;
