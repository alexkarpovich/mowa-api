const { gql } = require('apollo-server-express');

module.exports = gql`
  type Profile {
    id: ID!
    name: String!
    active: Boolean
    learnLang: Language
    transLang: Language
  }
`;
