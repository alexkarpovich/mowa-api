const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const config = require('../../../config');

const encryptPassword = (password, salt) => {
  salt = salt || (Math.random() + '');

  return {
    hash: crypto.createHmac('sha1', salt)
      .update(password)
      .digest('hex'),
    salt
  };
};

const checkPassword = (hashedPassword, password, salt) => {
  return hashedPassword === encryptPassword(password, salt).hash;
};

const signToken = (user) => {
  return jwt.sign({ uid: user.id }, config.get('secret'), {
    expiresIn: '1d'
  });
};

module.exports = { encryptPassword, checkPassword, signToken };
