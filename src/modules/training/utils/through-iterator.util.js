class ThroughIterator {
  constructor(driver, trainingId) {
    this.driver = driver;
    this.trainingId = trainingId;
  }

  async next() {
    const session = this.driver.session();

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

  async complete(translationId) {
    const session = this.driver.session();

    try {
      await session.run(`
        MATCH (train:Training{id: $id}), (trans:Translation{id: $translationId})
        MERGE (train)-[:HAS_COMPLETED]->(trans)
      `, { id: this.trainingId, translationId });

      return true;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      session.close();
    }
  }

  async reset() {
    const session = this.driver.session();

    await session.run(`
      MATCH (train:Training{id: $id})-[r:HAS_COMPLETED]->(trans:Translation)
      DELETE r
    `, { id: this.trainingId });

    return true;
  }
}

module.exports = ThroughIterator;
