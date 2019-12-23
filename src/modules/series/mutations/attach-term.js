const uuid = require('uuid/v4');

const Action = require('../../core/action');

class AttachTerm extends Action {
  async run() {
    const { id, value } = this.args;
    const { driver } = this.context;
    const session = driver.session();
    const params = { id, termId: uuid(), value };

    try {
      const { records } = await session.run(`
        MATCH (s:Series {id: $id})<-[:INCLUDES]-(p:Profile)-[:HAS_LEARNING_LANG]->(ll:Language)
        MERGE (ll)-[:INCLUDES]->(term:Term {value: $value})
        ON CREATE SET term.id = $termId
        MERGE (s)-[:INCLUDES]->(term)
        RETURN term
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

module.exports = AttachTerm;
