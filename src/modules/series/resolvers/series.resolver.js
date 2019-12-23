const TermsQuery = require('../queries/terms.query');
const EditSeries = require('../mutations/edit');
const DeleteSeries = require('../mutations/delete');
const AddTerm = require('../mutations/add-term');

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
    addTerm: (parent, args, context, info) =>
      AddTerm.exec({ parent, args, context, info }),
  }
};
