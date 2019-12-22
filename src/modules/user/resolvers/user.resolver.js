const UserSignup = require('../mutations/user-signup');
const UserLogin = require('../mutations/user-login');

module.exports = {
  Mutation: {
    signup: (parent, args, context, info) =>
      UserSignup.exec({ parent, args, context, info }),
    login: (parent, args, context, info) =>
      UserLogin.exec({ parent, args, context, info }),
  }
};
