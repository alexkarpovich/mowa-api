const { gql } = require('apollo-server-express');

module.exports = gql`
  type Series {
    id: ID!
    name: String!
  }

  type Query {
    terms(id: ID!): [Term!]!
  }

  type Mutation {
    editSeries(id: ID!, name: String!) : ID!
    deleteSeries(id: ID!) : ID!
    attachTerm(id: ID!, value: String) : Term!
    detachTerm(id: ID!, termId: ID!) : ID!
  }
`;
