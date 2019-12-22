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

  type Mutation {
    signup(input: UserCreateInput!) : AuthPayload!
    login(email: String!, password: String!) : AuthPayload!
  }

  input UserCreateInput {
    email: String!
    password: String!
  }
`;
