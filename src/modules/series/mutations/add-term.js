const uuid = require('uuid/v4');

const Action = require('../../core/action');

class AddTerm extends Action {
  async run() {
    const { id, value } = this.args;
    const { driver } = this.context;
    const session = driver.session();
    const params = { id, termId: uuid(), value };

    try {
      const { records } = await session.run(`
        MATCH (s:Series) WHERE s.id=$id
        CREATE (s)-[:INCLUDES]->(t:Term {id: $termId, value: $value})
        RETURN t
      `, params);

      return records[0].get('t').properties;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      session.close();
    }
  }
}

module.exports = AddTerm;
