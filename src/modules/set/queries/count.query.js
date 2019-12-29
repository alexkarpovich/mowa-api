const Action = require('../../core/action');

class CountQuery extends Action {
  async response() {
    const { driver } = this.context;
    const { id } = this.parent;
    const session = driver.session();

    try {
      const { records } = await session.run(`
        MATCH (s:Set{id: $id})-[:INCLUDES]->(t:Term)
        RETURN count(t) as count
      `, { id });

      return +records[0].get('count');
    } catch (err) {
      throw err;
    } finally {
      session.close()
    }
  }
}

module.exports = CountQuery;
