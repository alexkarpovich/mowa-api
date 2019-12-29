const Action = require('../../core/action');

class TrainingItem extends Action {
  async response() {
    const { driver } = this.context;
    const session = driver.session();

    try {
      const { records } = await session.run(`
        MATCH (train:Training{id: $id})-[:INCLUDES]->(s:Set)-[:INCLUDES]->(trans:Translation),
          (term:Term)<-[:FROM]-(trans)-[:TO]->(transTerm:Term)
        WHERE NOT (train)-[:HAS_COMPLETED]->(trans)
        WITH DISTINCT trans, term, transTerm
        RETURN rand() as r, term, {
          id: trans.id,
          value: transTerm.value,
          transcription: trans.transcription,
          details: trans.details
        } as translation
        ORDER BY r LIMIT 1
      `, this.args);

      if (!records.length) {
        return null;
      }

      return { term: records[0].get('term').properties, translation: records[0].get('translation') };
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      session.close();
    }
  }
}

module.exports = TrainingItem;
