const TranslationsQuery = require('../queries/translations.query');
const TranscriptionQuery = require('../queries/transcription.query');

module.exports = {
  Term: {
    translations: (parent, args, context, info) =>
      TranslationsQuery.exec({ parent, args, context, info }),
    transcription: (parent, args, context, info) =>
      TranscriptionQuery.exec({ parent, args, context, info }),
  }
};
