const { gql } = require('apollo-server-express');

module.exports = gql`
  type Tranlation {
    id: ID!
    value: String!
    transcription: String
    details: String
  }
`;
