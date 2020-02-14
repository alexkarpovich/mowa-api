const Action = require('../../core/action');
const Training = require('../utils/training.util');

class CompleteItem extends Action {
  async response() {
    const { driver } = this.context;
    const { id, translationId } = this.args;

    const training = await Training.init({ driver, id });

    return training.complete(translationId);
  }
}

module.exports = CompleteItem;
