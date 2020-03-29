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

  type TrainingMetaStage {
    id: Int!
    cycles: Int!
    complete: Int!
  }

  type TrainingMeta {
    type: Int!
    complete: Int!
    total: Int!
    stages: [TrainingMetaStage!]
  }

  type Query {
    trainingMeta(id: ID!) : TrainingMeta!
    trainingItem(id: ID!) : TrainingItem
  }

  type Mutation {
    ensureTraining(type: Int!, setIds: [ID!]!) : Training!
    resetTraining(id: ID!) : Boolean!
    completeItem(id: ID!, translationId: ID!) : Boolean!
  }
`;
