const Action = require('../../core/action');
const Training = require('../utils/training.util');

class ResetTraining extends Action {
  async response() {
    const { driver } = this.context;
    const { id } = this.args;

    const training = await Training.init({ driver, id });

    return training.reset();
  }
}

module.exports = ResetTraining;
