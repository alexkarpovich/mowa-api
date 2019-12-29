const Action = require('../../core/action');

class DeleteSet extends Action {
  async response() {
    const { id } = this.args;
    const { driver } = this.context;
    const session = driver.session();

    try {
      await session.run(`
        MATCH (s:Set) WHERE s.id=$id
        DETACH DELETE s
      `, { id });

      return id;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      session.close();
    }
  }
}

module.exports = DeleteSet;
