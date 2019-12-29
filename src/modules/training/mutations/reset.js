const Action = require('../../core/action');

class ResetTraining extends Action {
  async response() {
    const { driver } = this.context;
    const session = driver.session();

    try {
      await session.run(`
        MATCH (train:Training{id: $id})-[r:HAS_COMPLETED]->(trans:Translation)
        DELETE r
      `, this.args);

      return true;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      session.close();
    }
  }
}

module.exports = ResetTraining;
