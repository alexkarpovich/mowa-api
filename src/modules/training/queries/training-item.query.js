const Action = require('../../core/action');

class TrainingItem extends Action {
  async response() {
    const { trainingId } = this.args;
    const { driver } = this.context;
    const session = driver.session();

    try {
      const { records } = await session.run(`
        MATCH (train:Training{id: $trainingId})-[:INCLUDES]->(s:Set)-[:INCLUDES]->(trans:Translation),
          (term:Term)<-[:FROM]-(trans)-[:TO]->(transTerm:Term)
        WITH DISTINCT trans, term, transTerm
        RETURN rand() as r, term, {
          id: trans.id,
          value: transTerm.value,
          transcription: trans.transcription,
          details: trans.details
        } as translation
        ORDER BY r LIMIT 1
      `, { trainingId });

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
