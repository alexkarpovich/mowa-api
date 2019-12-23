const Action = require('../../core/action');

class SeriesQuery extends Action {
  async run() {
    const { driver, user } = this.context;
    const session = driver.session();
    const params = { uid: user.id };

    try {
      const { records } = await session.run(`
        MATCH (u:User)-[:OWNS]->(p:Profile)<-[:INCLUDES]-(:Active), (p)-[:INCLUDES]->(s:Series) WHERE u.id=$uid
        RETURN s
      `, params);

      return records.map(rec => rec.get('s').properties);
    } catch (err) {
      throw err;
    } finally {
      session.close()
    }
  }
}

module.exports = SeriesQuery;
