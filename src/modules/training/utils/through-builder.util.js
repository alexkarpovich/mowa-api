const { TYPE_THROUGH } = require('./constant.util');
const BaseBuilder = require('./base-builder.util');

class ThroughBuilder extends BaseBuilder {
  constructor(driver, setIds) {
    super(driver, TYPE_THROUGH, setIds);
  }

  async build() {
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

module.exports = ThroughBuilder;
