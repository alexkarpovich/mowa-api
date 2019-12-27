const Action = require('../../core/action');

class AttachExistingTranslation extends Action {
  async run() {
    const { input } = this.args;
    const { driver } = this.context;
    const session = driver.session();

    try {
      const { records } = await session.run(`
        MATCH
          (p:Profile)-[:INCLUDES]->(s:Set {id: $setId}),
          (trans:Translation{id: $id})-[:TO]->(transTerm:Term)
        MERGE (s)-[:INCLUDES]->(trans)
        RETURN trans, transTerm
      `, input);

      return { ...records[0].get('trans').properties, value: records[0].get('transTerm').properties.value };
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      session.close();
    }
  }
}

module.exports = AttachExistingTranslation;
