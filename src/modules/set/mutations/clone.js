const uuid = require('uuid/v4');

const Action = require('../../core/action');

class Clone extends Action {
  async response() {
    const { ids, name } = this.args;
    const { driver } = this.context;
    const session = driver.session();
    const params = { ids, cloneId: uuid(), name};

    try {
      const { records } = await session.run(`  
        MATCH (s:Set)<-[:INCLUDES]-(p:Profile) WHERE s.id IN $ids
        CREATE (clone:Set{id: $cloneId, name: $name})<-[:INCLUDES]-(p)
        WITH s, clone
        MATCH (term:Term)<-[:INCLUDES]-(s)-[INCLUDES]->(trans:Translation)
        MERGE (trans)<-[:INCLUDES]-(clone)
        MERGE (clone)-[:INCLUDES]->(term)
        RETURN clone
      `, params);

      //await mq.publishTerm(value);

      return records[0].get('clone').properties;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      session.close();
    }
  }
}

module.exports = Clone;
