const Action = require('../../core/action');
const TrainingBuilder = require('../utils/training-builder.util');

class EnsureTraining extends Action {

  async response() {
    const { driver } = this.context;
    const { type, setIds } = this.args;

    const builder = new TrainingBuilder(driver, type, setIds);

    return builder.build();
  }
}

module.exports = EnsureTraining;
