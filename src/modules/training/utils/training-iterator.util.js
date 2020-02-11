const { TYPE_THROUGH, TYPE_CYCLES } = require('./constant.util');
const ThroughIterator = require('./through-iterator.util');
const CyclesIterator = require('./cycles-iterator.util');

class TrainingIterator {
  constructor(driver, trainingId) {
    this.driver = driver;
    this.trainingId = trainingId;
  }

  async _getIterator() {
    const session = this.driver.session();
    let type;
    try {
      type = await this.getType(session);
    } catch (err) {
      throw err;
    } finally {
      session.close()
    }

    switch (type) {
      case TYPE_CYCLES:
        return new CyclesIterator(this.driver, this.trainingId);
      case TYPE_THROUGH:
      default:
        return new ThroughIterator(this.driver, this.trainingId);
    }
  }

  async getType(session) {
    const { trainingId } = this;

    const { records } = await session.run(`
        MATCH (train:Training{id: $id})
        RETURN train.type as type
      `, { id: trainingId });

    return records.length ? +records[0].get('type') : null;
  }

  async next() {
    const iterator = await this._getIterator();

    return iterator.next();
  }

  async complete(translationId) {
    const iterator = await this._getIterator();

    return iterator.complete(translationId);
  }
}

module.exports = TrainingIterator;
