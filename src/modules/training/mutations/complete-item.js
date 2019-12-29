const Action = require('../../core/action');

class CompleteItem extends Action {
  async response() {
    const { driver } = this.context;
    const session = driver.session();

    try {
      await session.run(`
        MATCH (train:Training{id: $id}), (trans:Translation{id: $translationId})
        MERGE (train)-[:HAS_COMPLETED]->(trans)
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

module.exports = CompleteItem;
