class ThroughBuilder {
  constructor(driver) {
    this.driver = driver;
  }

  async build() {
    return true;
  }
}

module.exports = ThroughBuilder;
