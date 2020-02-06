const Action = require('../../core/action');
const ensureTraining = require('../utils/ensure-training.util');

class EnsureTraining extends Action {

  async response() {
    const { driver } = this.context;
    const { type, setIds } = this.args;

    return ensureTraining(driver, type, setIds);
  }
}

module.exports = EnsureTraining;
