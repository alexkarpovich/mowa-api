const jwt = require('jsonwebtoken');

const redisClient = require('../settings/redis');
const config = require('../config');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, config.get('secret'));
    //const user = await User.findById(decoded.uid).exec();

    //console.log(user);

    req.user = null;
  } catch (err) {
    req.user = null;
  }

  next()
};
