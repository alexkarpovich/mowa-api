const ProfilesQuery = require('../queries/profiles.query');
const SetsQuery = require('../queries/sets.query');
const SearchTranslations = require('../queries/search-translations.query');
const UserSignup = require('../mutations/user-signup');
const UserLogin = require('../mutations/user-login');
const AddProfile = require('../mutations/add-profile');
const ActivateProfile = require('../mutations/activate-profile');
const AddSet = require('../mutations/add-set');

module.exports = {
  Query: {
    me: (parent, args, context, info) => context.me,
    profiles: (parent, args, context, info) =>
      ProfilesQuery.exec({ parent, args, context, info }),
    sets: (parent, args, context, info) =>
      SetsQuery.exec({ parent, args, context, info }),
    searchTranslations: (parent, args, context, info) =>
      SearchTranslations.exec({ parent, args, context, info }),
  },
  Mutation: {
    signup: (parent, args, context, info) =>
      UserSignup.exec({ parent, args, context, info }),
    login: (parent, args, context, info) =>
      UserLogin.exec({ parent, args, context, info }),
    addProfile: (parent, args, context, info) =>
      AddProfile.exec({ parent, args, context, info}),
    activateProfile: (parent, args, context, info) =>
      ActivateProfile.exec({ parent, args, context, info }),
    addSet: (parent, args, context, info) =>
      AddSet.exec({ parent, args, context, info }),
  },
  User: {
    profiles: (parent, args, context, info) =>
      ProfilesQuery.exec({ parent, args, context, info }),
  }
};
