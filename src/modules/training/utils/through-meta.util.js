class ThroughMeta {
  constructor(driver, trainingId) {
    this.driver = driver;
    this.trainingId = trainingId;
  }

  async collect() {
    const session = this.driver.session();

    const { records } = await session.run(`
        MATCH (train:Training{id: $id})-[:INCLUDES]->(s:Set)-[:INCLUDES]->(tr:Translation)
        OPTIONAL MATCH (train)-[:HAS_COMPLETED]->(complete:Translation)
        RETURN {
          type: train.type,
          total: count(DISTINCT tr),
          complete: count(DISTINCT complete)
        } as meta
    `, { id: this.trainingId });

    const meta = records[0].get('meta');

    return {
      type: +meta.type,
      total: +meta.total,
      complete: +meta.complete,
    };
  }
}

module.exports = ThroughMeta;
