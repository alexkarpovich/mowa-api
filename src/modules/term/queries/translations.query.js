const Action = require('../../core/action');

class TranslationsQuery extends Action {
  async run() {

    console.log("HELLO", this.parent);
    const { driver } = this.context;
    const { id } = this.args;
    const session = driver.session();

    try {
      const { records } = await session.run(`
        MATCH (s:Set)-[:INCLUDES]->(t:Term) WHERE s.id=$id
        RETURN t
      `, { id });

      return [];
    } catch (err) {
      throw err;
    } finally {
      session.close()
    }
  }
}

module.exports = TranslationsQuery;
