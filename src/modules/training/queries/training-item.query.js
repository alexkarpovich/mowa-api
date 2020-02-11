const Action = require('../../core/action');
const TrainingIterator = require('../utils/training-iterator.util');

class TrainingItem extends Action {
  async response() {
    const { driver } = this.context;
    const { id } = this.args;

    const iterator = new TrainingIterator(driver, id);

    return iterator.next();
  }
}

module.exports = TrainingItem;
