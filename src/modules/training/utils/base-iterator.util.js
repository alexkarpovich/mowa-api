class BaseIterator {
  constructor(driver, trainingId) {
    this.driver = driver;
    this.trainingId = trainingId;
  }

  async next() {
    throw new Error('The method should be implemented in child class');
  }

  async complete() {
    throw new Error('The method should be implemented in child class');
  }
}

module.exports = BaseIterator;

