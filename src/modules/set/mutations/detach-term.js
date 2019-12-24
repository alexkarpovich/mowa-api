const Action = require('../../core/action');

class DetachTerm extends Action {
  async run() {
    const { id, termId } = this.args;
    const { driver } = this.context;
    const session = driver.session();

    try {
      await session.run(`
        MATCH (s:Set)-[ri:INCLUDES]->(t:Term) WHERE s.id=$id AND t.id=$termId
        DELETE (ri)
      `, { id, termId });

      return termId;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      session.close();
    }
  }
}

module.exports = DetachTerm;
