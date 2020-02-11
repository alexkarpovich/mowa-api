const { TYPE_THROUGH, TYPE_CYCLES } = require('./constant.util');
const ThroughBuilder = require('./through-builder.util');
const CyclesBuilder = require('./cycles-builder.util');

class TrainingBuilder {
  constructor(driver, type, setIds) {
    this.driver = driver;
    this.type = type;
    this.setIds = setIds;
    this._builder = this._getBuilder();
  }

  _getBuilder() {
    switch (this.type) {
      case TYPE_CYCLES:
        return new CyclesBuilder(this.driver, this.setIds);
      case TYPE_THROUGH:
      default:
        return new ThroughBuilder(this.driver, this.setIds);
    }
  }

  async build() {
    return this._builder.build();
  }
}

module.exports = TrainingBuilder;
