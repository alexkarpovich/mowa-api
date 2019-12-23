const TermsQuery = require('../queries/terms.query');
const EditSeries = require('../mutations/edit');
const DeleteSeries = require('../mutations/delete');
const AttachTerm = require('../mutations/attach-term');
const DetachTerm = require('../mutations/detach-term');

module.exports = {
  Query: {
    terms: (parent, args, context, info) =>
      TermsQuery.exec({ parent, args, context, info }),
  },
  Mutation: {
    editSeries: (parent, args, context, info) =>
      EditSeries.exec({ parent, args, context, info }),
    deleteSeries: (parent, args, context, info) =>
      DeleteSeries.exec({ parent, args, context, info }),
    attachTerm: (parent, args, context, info) =>
      AttachTerm.exec({ parent, args, context, info }),
    detachTerm: (parent, args, context, info) =>
      DetachTerm.exec({ parent, args, context, info }),
  }
};
