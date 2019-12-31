const jwt = require('jsonwebtoken');

const config = require('../config');
const { me } = require('../modules/user/utils/me.utils');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, config.get('secret'));

    const user = await me(decoded.uid);

    req.user = user || null;
  } catch (err) {
    req.user = null;
  }

  next()
};
