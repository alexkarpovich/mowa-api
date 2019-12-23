const { gql } = require('apollo-server-express');

module.exports = gql`
  type Translation {
    id: ID!
    value: String!
    transcription: String
    details: String
  }
`;
