const { chunk, shuffle } = require('lodash');
const Training = require('./training.util');

const MIN_CHUNK_SIZE = 7;

class TrainingCycles extends Training {
  constructor(driver, setIds) {
    super(driver, Training.TYPE_CYCLES, setIds);
  }

  async countTranslations(session, trainingId) {
    const { records } = await session.run(`
        MATCH (train:Training{id: $trainingId})-[:INCLUDES]->(s:Set)-[:INCLUDE]->(trans:Translation)
        RETURN COUNT(DISTINCT trans) as count
      `, { trainingId });

    return +records[0].get('count');
  }

  async getTranslationIds(session, trainingId) {
    const { records } = await session.run(`
      MATCH (train:Training{id: $trainingId})-[:INCLUDES]->(s:Set)-[:INCLUDES]->(trans:Translation)
      RETURN DISTINCT trans.id as id
    `, { trainingId });

    return records.map(rec => rec.get('id'));
  }

  async buildStages(session, trainingId, stages) {
    const { records } = await session.run(`
      MATCH (train:Training{id: $trainingId})
      UNWIND range(0, size($stages)-1) as sid
      OPTIONAL MATCH (train)-[:INCLUDES]->(pst:Stage{level: sid})
      WITH train, $stages[sid] as cycles, sid, pst
      MERGE (train)-[:INCLUDES]->(st:Stage{level: sid+1})
        ON CREATE SET st.prev = CASE sid WHEN 0 THEN [] ELSE [sid] END,
          st.active = CASE sid WHEN 0 THEN [1] ELSE [0] END
      FOREACH(i IN st.active |
        MERGE (:Active)-[:INCLUDES]->(st)
        REMOVE st.active
      )
      FOREACH(i IN st.prev |
        MERGE (pst)-[:NEXT]->(st)
        REMOVE st.prev
      )
      WITH st, cycles
      UNWIND cycles as cycle
      WITH st, cycle
      UNWIND cycle as transId
      MATCH (trans:Translation{id: transId})
      MERGE (st)-[:INCLUDES]->(trans)
    `, { trainingId, stages });

    return records.map(rec => rec.get('id'));
  }

  async initialize() {
    const session = this.driver.session();

    let training = await this.matchExisting(session);

    if (training) {
      return training;
    }

    console.log(training);

    return session.readTransaction(async (txc) => {
      training = await this.assignSets(txc);
      const transIds = await this.getTranslationIds(txc, training.id);
      const count = transIds.length;
      const stageCount = Math.round(Math.log(count * 1. / MIN_CHUNK_SIZE) / Math.log(2));
      let stages = Array.from(Array(stageCount).keys());

      let ids, chunkSize;

      stages = stages.map((k) => {
        ids = shuffle(transIds);
        chunkSize = count / (MIN_CHUNK_SIZE * Math.pow(2, k));

        return chunkSize ? chunk(ids, chunkSize) : ids;
      });

      await this.buildStages(txc, training.id, stages);

      return training;
    }).then(training => training)
      .catch(e => console.log(e))
      .finally(() => session.close());
  }
}

module.exports = TrainingCycles;
