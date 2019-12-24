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
    sets: [Set!]!
    searchTranslations(value: String!): [Translation!]!
  }

  type Mutation {
    signup(input: UserCreateInput!) : AuthPayload!
    login(email: String!, password: String!) : AuthPayload!
    addProfile(input: AddProfileInput!) : Profile!
    addSet(name: String!) : Set!
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
`;
