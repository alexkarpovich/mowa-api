const Action = require('../../core/action');

class TermsQuery extends Action {
  async run() {
    const { driver } = this.context;
    const { ids } = this.args;
    const session = driver.session();

    try {
      const { records } = await session.run(`
        MATCH (s:Set)-[:INCLUDES]->(t:Term) WHERE s.id IN $ids
        RETURN distinct t
      `, { ids });

      return records.map(rec => rec.get('t').properties);
    } catch (err) {
      throw err;
    } finally {
      session.close()
    }
  }
}

module.exports = TermsQuery;
