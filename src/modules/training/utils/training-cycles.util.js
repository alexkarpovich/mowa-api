const Training = require('./training.util');

class TrainingCycles extends Training {
  constructor(driver, setIds) {
    super(driver, Training.TYPE_CYCLES, setIds);
  }

  async countTranslations(session, trainingId) {
    return session.run(`
        MATCH (train:Training{id: $trainingId})-[:INCLUDES]->(s:Set)-[:INCLUDE]->(trans:Translation)
        RETURN COUNT(DISTINCT trans) as count
      `, { trainingId });
  }

  async initialize() {
    const session = this.driver.session();

    try {
      let training = await this.matchExisting(session);

      if (training) {
        return training;
      }

      training = await this.assignSets(session);
      const count = await this.countTranslations(session, training.id);
      const stageCount = Math.round(Math.log(count / 7.) / Math.log(2));

      console.log(stageCount);

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
