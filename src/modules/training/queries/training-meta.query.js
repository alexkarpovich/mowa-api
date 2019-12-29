const Action = require('../../core/action');

class TrainingMeta extends Action {
  formatResponse(data) {
    return {
      type: +data.type,
      total: +data.total,
      complete: +data.complete
    };
  }

  async response() {
    const { id } = this.args;
    const { driver } = this.context;
    const session = driver.session();

    try {
      const { records } = await session.run(`
        MATCH (train:Training{id: $id})-[:INCLUDES]->(s:Set)-[:INCLUDES]->(tr:Translation)
        OPTIONAL MATCH (train)-[:HAS_COMPLETED]->(complete:Translation)
        RETURN { type: train.type, total: count(DISTINCT tr), complete: count(DISTINCT complete) } as meta
      `, { id });

      return this.formatResponse(records[0].get('meta'));
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      session.close();
    }
  }
}

module.exports = TrainingMeta;
