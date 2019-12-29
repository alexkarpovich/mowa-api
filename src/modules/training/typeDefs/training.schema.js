const { gql } = require('apollo-server-express');

module.exports = gql`
  type Training {
    id: ID!
    type: Int!
  }

  type TrainingItem {
    term: Term!
    translation: Translation!
  }

  type Query {
    trainingItem(trainingId: ID!) : TrainingItem!
  }

  type Mutation {
    ensureTraining(type: Int!, setIds: [ID!]!) : Training!
  }
`;
