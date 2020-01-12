const uuid = require('uuid/v4');

const Action = require('../../core/action');

class AttachTerm extends Action {
  async response() {
    const { id, value } = this.args;
    const { driver, mq } = this.context;
    const session = driver.session();
    const params = { id, termId: uuid(), value };

    try {
      const { records } = await session.run(`
        MATCH (s:Set {id: $id})<-[:INCLUDES]-(p:Profile)-[:HAS_LEARNING_LANG]->(ll:Language)
        MERGE (ll)-[:INCLUDES]->(term:Term {value: $value})
        ON CREATE SET term.id = $termId
        MERGE (s)-[:INCLUDES]->(term)
        RETURN term
      `, params);

      await mq.publishTerm(value);

      return records[0].get('term').properties;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      session.close();
    }
  }
}

module.exports = AttachTerm;
