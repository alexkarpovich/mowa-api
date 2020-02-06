const { chunk, shuffle } = require('lodash');
const Training = require('./training.util');

const MIN_CHUNK_SIZE = 7;

class TrainingCycles extends Training {
  constructor(driver, setIds) {
    super(driver, Training.TYPE_CYCLES, setIds);
  }

  async countTranslations(session, trainingId) {
    const { records } = session.run(`
        MATCH (train:Training{id: $trainingId})-[:INCLUDES]->(s:Set)-[:INCLUDE]->(trans:Translation)
        RETURN COUNT(DISTINCT trans) as count
      `, { trainingId });

    return +records[0].get('count');
  }

  async getTranslationIds(session, trainingId) {
    const { records } = session.run(`
      MATCH (train:Training{id: $trainingId})-[:INCLUDES]->(s:Set)-[:INCLUDES]->(trans:Translation)
      WITH DISTINCT trans.id as id
    `, { trainingId });

    return records.map(rec => rec.get('id'));
  }

  async initialize() {
    const session = this.driver.session();

    try {
      let training = await this.matchExisting(session);

      if (training) {
        return training;
      }

      training = await this.assignSets(session);
      const transIds = await this.getTranslationIds(session, training.id);
      const count = transIds.length;
      const stageCount = Math.round(Math.log(count * 1. / MIN_CHUNK_SIZE) / Math.log(2));
      let stages = Array.from(Array(stageCount).keys());

      console.log(count, stageCount);
      let ids, chunkSize;

      stages = stages.map((k) => {
        ids = shuffle(transIds);
        chunkSize = count / (MIN_CHUNK_SIZE * Math.pow(2, k));

        return chunkSize ? chunk(ids, chunkSize) : ids;
      });

      console.log(stages);

      return training;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      session.close();
    }
  }
}

module.exports = TrainingCycles;
