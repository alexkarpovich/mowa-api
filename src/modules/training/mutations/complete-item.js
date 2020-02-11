const Action = require('../../core/action');
const TrainingIterator = require('../utils/training-iterator.util');

class CompleteItem extends Action {
  async response() {
    const { driver } = this.context;
    const { id, translationId } = this.args;

    const iterator = new TrainingIterator(driver, id);

    return iterator.complete(translationId);
  }
}

module.exports = CompleteItem;
