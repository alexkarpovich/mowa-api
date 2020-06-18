const Action = require('../../core/action');
const Training = require('../utils/training.util');

class EnsureTraining extends Action {

  async response() {
    const { driver } = this.context;
    const { type, setIds } = this.args;

    const training = await Training.init({ driver, type, setIds });

    training.build();

    return training;
  }
}

module.exports = EnsureTraining;
