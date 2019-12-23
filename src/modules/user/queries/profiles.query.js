const Action = require('../../core/action');

class ProfilesQuery extends Action {
  async run() {
    const { driver, user } = this.context;
    const session = driver.session();
    const params = { uid: user.id };

    try {
      const { records } = await session.run(`
        MATCH (u:User)-[:OWNS]->(p:Profile) WHERE u.id=$uid
        RETURN p
      `, params);

      return records.map(rec => rec.get('p').properties);
    } catch (err) {
      throw err;
    } finally {
      session.close()
    }
  }
}

module.exports = ProfilesQuery;
