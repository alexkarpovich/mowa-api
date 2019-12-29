const TrainingItemQuery = require('../queries/training-item.query');
const EnsureTraining = require('../mutations/ensure-translation');

module.exports = {
  Query: {
    trainingItem: (parent, args, context, info) =>
      TrainingItemQuery.exec({ parent, args, context, info }),
  },
  Mutation: {
    ensureTraining: (parent, args, context, info) =>
      EnsureTraining.exec({ parent, args, context, info }),
  }
};
