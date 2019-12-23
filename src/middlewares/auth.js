const jwt = require('jsonwebtoken');

const driver = require('../settings/neo4j');
const redisClient = require('../settings/redis');
const config = require('../config');

module.exports = async (req, res, next) => {
  const session = driver.session();

  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, config.get('secret'));

    const { records } = await session.run(`
      MATCH (user:User) WHERE user.id=$uid RETURN user
    `, { uid: decoded.uid });

    const user = records[0].get('user').properties;

    console.log(user);

    req.user = user || null;
  } catch (err) {
    req.user = null;
  } finally {
    session.close()
  }

  next()
};
