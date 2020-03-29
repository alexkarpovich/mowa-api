const Action = require('../../core/action');
const Training = require('../utils/training.util');

class TrainingMeta extends Action {

  async response() {
    const { id } = this.args;
    const { driver } = this.context;

    const training = await Training.init({ driver, id });

    return training.meta();
  }
}

module.exports = TrainingMeta;
