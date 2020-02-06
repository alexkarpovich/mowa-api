const Training = require('./training.util');

class TrainingThrough extends Training {
  constructor(driver, setIds) {
    super(driver, Training.TYPE_THROUGH, setIds);
  }

  async initialize() {
    const session = this.driver.session();

    try {
      let training = await this.matchExisting(session);

      if (training) {
        return training;
      }

      training = await this.assignSets(session);

      return training;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      session.close();
    }
  }
}

module.exports = TrainingThrough;
