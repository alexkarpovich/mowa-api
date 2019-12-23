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
  }

  type Mutation {
    signup(input: UserCreateInput!) : AuthPayload!
    login(email: String!, password: String!) : AuthPayload!
    addProfile(input: AddProfileInput!) : Profile!
    addSeries(name: String!) : Series!
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
