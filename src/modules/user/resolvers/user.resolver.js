const ProfilesQuery = require('../queries/profiles.query');
const SeriesQuery = require('../queries/series.query');
const UserSignup = require('../mutations/user-signup');
const UserLogin = require('../mutations/user-login');
const AddProfile = require('../mutations/add-profile');
const AddSeries = require('../mutations/add-series');

module.exports = {
  Query: {
    profiles: (parent, args, context, info) =>
      ProfilesQuery.exec({ parent, args, context, info }),
    series: (parent, args, context, info) =>
      SeriesQuery.exec({ parent, args, context, info })
  },
  Mutation: {
    signup: (parent, args, context, info) =>
      UserSignup.exec({ parent, args, context, info }),
    login: (parent, args, context, info) =>
      UserLogin.exec({ parent, args, context, info }),
    addProfile: (parent, args, context, info) =>
      AddProfile.exec({ parent, args, context, info}),
    addSeries: (parent, args, context, info) =>
      AddSeries.exec({ parent, args, context, info }),
  }
};
