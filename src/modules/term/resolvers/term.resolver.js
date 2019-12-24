const TranslationsQuery = require('../queries/translations.query');

module.exports = {
  Term: {
    translations: (parent, args, context, info) =>
      TranslationsQuery.exec({ parent, args, context, info }),
  }
};
