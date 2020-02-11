const BaseIterator = require('./base-iterator.util');

class CyclesIterator extends BaseIterator {
  constructor(driver, trainingId) {
    super(driver, trainingId);
  }

  async next() {
    const session = this.driver.session();

    try {
      const { records } = await session.run(`
        MATCH (train:Training{id: $id})-[:INCLUDES]->(stage:Stage)<-[:INCLUDES]-(active:Active),
          (stage)-[:INCLUDES]->(cycle:Cycle)<-[:INCLUDES]-(active),
          (cycle)-[:INCLUDES]->(trans:Translation),
          (term:Term)<-[:FROM]-(trans)-[:TO]->(transTerm:Term)
        WHERE NOT (stage)-[:HAS_COMPLETED]->(trans)
        WITH DISTINCT trans, term, transTerm
        RETURN rand() as r, term, {
          id: trans.id,
          value: transTerm.value,
          transcription: trans.transcription,
          details: trans.details
        } as translation
        ORDER BY r LIMIT 1
      `, { id: this.trainingId });

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

  async markTranslation(session, translationId) {
    await session.run(`
      MATCH (train:Training{id: $id})-[:INCLUDES]->(stage:Stage)<-[:INCLUDES]-(active:Active),
      (trans:Translation{id: $translationId})
      MERGE (stage)-[:HAS_COMPLETED]->(trans)
    `, { id: this.trainingId, translationId });

    return true;
  }

  async checkStageCycles(session) {
    const { records } = await session.run(`
      MATCH (train:Training{id: $id})-[:INCLUDES]->(stage:Stage)<-[:INCLUDES]-(active:Active),
      (stage)-[:INCLUDES]->(cycle:Cycle)<-[rac:INCLUDES]-(active)
      OPTIONAL MATCH (stage)-[:INCLUDES]->(nextCycle:Cycle{id: cycle.id+1})
      OPTIONAL MATCH (cycle)-[:INCLUDES]->(trans:Translation)
      WHERE NOT (stage)-[:HAS_COMPLETED]->(trans)
      WITH active, stage, nextCycle, rac, CASE WHEN COUNT(trans)=0 and COUNT(nextCycle)=1 THEN [1] ELSE [] END as switchCycle
      FOREACH(i IN switchCycle |
        MERGE (active)-[:INCLUDES]->(nextCycle)
        DELETE rac
      )
      WITH stage
      MATCH (stage)-[:INCLUDES]->(:Cycle)-[:INCLUDES]->(availableTrans:Translation)
      WHERE NOT (stage)-[:HAS_COMPLETED]->(availableTrans)
      RETURN COUNT(availableTrans) as count
    `, { id: this.trainingId });

    console.log(+records[0].get('count'));

    return !+records[0].get('count')
  }

  async complete(translationId) {
    const session = this.driver.session();

    return session.readTransaction(async (txc) => {
      await this.markTranslation(txc, translationId);
      const isStageComplete = await this.checkStageCycles(txc);

      if (isStageComplete) {
        console.log('hello, stage complete');
        //throw new Error('hello');
      }

      return true;

    }).catch(e => console.log(e))
      .finally(() => session.close());
  }
}

module.exports = CyclesIterator;
