const TermsQuery = require('../queries/terms.query');
const CountQuery = require('../queries/count.query');
const EditSet = require('../mutations/edit');
const DeleteSet = require('../mutations/delete');
const AttachTerm = require('../mutations/attach-term');
const DetachTerm = require('../mutations/detach-term');
const AttachTranslation = require('../mutations/attach-translation');
const DetachTranslation = require('../mutations/detach-translation');

module.exports = {
  Query: {
    terms: (parent, args, context, info) =>
      TermsQuery.exec({ parent, args, context, info }),
  },
  Mutation: {
    editSet: (parent, args, context, info) =>
      EditSet.exec({ parent, args, context, info }),
    deleteSet: (parent, args, context, info) =>
      DeleteSet.exec({ parent, args, context, info }),
    attachTerm: (parent, args, context, info) =>
      AttachTerm.exec({ parent, args, context, info }),
    detachTerm: (parent, args, context, info) =>
      DetachTerm.exec({ parent, args, context, info }),
    attachTranslation: (parent, args, context, info) =>
      AttachTranslation.exec({ parent, args, context, info }),
    detachTranslation: (parent, args, context, info) =>
      DetachTranslation.exec({ parent, args, context, info }),
  },
  Set: {
    count: (parent, args, context, info) =>
      CountQuery.exec({ parent, args, context, info }),
  }
};
