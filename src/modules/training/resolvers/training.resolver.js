const TrainingItemQuery = require('../queries/training-item.query');
const TrainingMetaQuery = require('../queries/training-meta.query');
const EnsureTraining = require('../mutations/ensure-training');
const ResetTraining = require('../mutations/reset');
const CompleteItem = require('../mutations/complete-item');

module.exports = {
  Query: {
    trainingItem: (parent, args, context, info) =>
      TrainingItemQuery.exec({ parent, args, context, info }),
    trainingMeta: (parent, args, context, info) =>
      TrainingMetaQuery.exec({ parent, args, context, info }),
  },
  Mutation: {
    ensureTraining: (parent, args, context, info) =>
      EnsureTraining.exec({ parent, args, context, info }),
    resetTraining: (parent, args, context, info) =>
      ResetTraining.exec({ parent, args, context, info }),
    completeItem: (parent, args, context, info) =>
      CompleteItem.exec({ parent, args, context, info }),
  }
};
