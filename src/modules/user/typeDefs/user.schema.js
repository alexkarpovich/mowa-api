const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    email: String!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type Query {
    profiles: [Profile!]!
    series: [Series!]!
    searchTranslations(value: String!): [Translation!]!
  }

  type Mutation {
    signup(input: UserCreateInput!) : AuthPayload!
    login(email: String!, password: String!) : AuthPayload!
    addProfile(input: AddProfileInput!) : Profile!
    addSeries(name: String!) : Series!
    attachTranslation(input: AttachTranslationInput!) : Translation!
    detachTranslation(seriesId: ID!, translationId: ID!) : Boolean!
  }

  input UserCreateInput {
    email: String!
    password: String!
  }

  input AddProfileInput {
    name: String!
    learnLang: String!
    transLang: String!
  }

  input AttachTranslationInput {
    seriesId: ID!
    termId: ID!
    value: String!
    transcription: String
    details: String
  }
`;
