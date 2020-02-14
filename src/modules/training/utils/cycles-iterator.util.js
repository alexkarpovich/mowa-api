class CyclesIterator {
  constructor(driver, trainingId) {
    this.driver = driver;
    this.trainingId = trainingId;
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
    await session.run(`
      MATCH (train:Training{id: $id})-[:INCLUDES]->(stage:Stage)<-[ras:INCLUDES]-(active:Active),
      (stage)-[:INCLUDES]->(cycle:Cycle)<-[rac:INCLUDES]-(active)
      OPTIONAL MATCH (stage)-[:INCLUDES]->(nextCycle:Cycle{id: cycle.id+1})
      OPTIONAL MATCH (cycle)-[:INCLUDES]->(trans:Translation)
      WHERE NOT (stage)-[:HAS_COMPLETED]->(trans)
      WITH active, train, stage, nextCycle, ras, rac, CASE WHEN COUNT(trans)=0 and COUNT(nextCycle)=1 THEN [1] ELSE [] END as switchCycle
      FOREACH(i IN switchCycle |
        MERGE (active)-[:INCLUDES]->(nextCycle)
        DELETE rac
      )
      WITH active, train, stage, ras, rac
      OPTIONAL MATCH (train)-[:INCLUDES]->(nextStage:Stage{id: stage.id+1})-[:INCLUDES]->(firstCycle:Cycle{id: 1})
      OPTIONAL MATCH (stage)-[:INCLUDES]->(:Cycle)-[:INCLUDES]->(availableTrans:Translation)
      WHERE NOT (stage)-[:HAS_COMPLETED]->(availableTrans)
      WITH active, nextStage, firstCycle, ras, rac, CASE WHEN COUNT(availableTrans)=0 and COUNT(nextStage)=1 THEN [1] ELSE [] END as switchStage
      FOREACH(i IN switchStage |
        MERGE (nextStage)<-[:INCLUDES]-(active)-[:INCLUDES]->(firstCycle)
        DELETE ras
        DELETE rac
      )
    `, { id: this.trainingId });
  }

  async complete(translationId) {
    const session = this.driver.session();

    return session.readTransaction(async (txc) => {
      await this.markTranslation(txc, translationId);
      await this.checkStageCycles(txc);

      return true;

    }).catch(e => console.log(e))
      .finally(() => session.close());
  }
}

module.exports = CyclesIterator;
