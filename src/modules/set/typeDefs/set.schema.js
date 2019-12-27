const { gql } = require('apollo-server-express');

module.exports = gql`
  type Set {
    id: ID!
    name: String!
    count: Int!
  }

  type Query {
    terms(id: ID!): [Term!]!
  }

  type Mutation {
    editSet(id: ID!, name: String!) : ID!
    deleteSet(id: ID!) : ID!
    attachTerm(id: ID!, value: String) : Term!
    detachTerm(id: ID!, termId: ID!) : ID!
    attachTranslation(input: AttachTranslationInput!) : Translation!
    attachExistingTranslation(input: AttachExistingTranslationInput!) : Boolean!
    detachTranslation(setId: ID!, translationId: ID!) : Boolean!
  }

  input AttachExistingTranslationInput {
    setId: ID!
    termId: ID!
    id: ID!
  }

  input AttachTranslationInput {
    setId: ID!
    termId: ID!
    value: String!
    transcription: String
    details: String
  }
`;
