const Action = require('../../core/action');

class EditSet extends Action {
  async run() {
    const { id, name } = this.args;
    const { driver } = this.context;
    const session = driver.session();

    try {
      await session.run(`
        MATCH (s:Set) WHERE s.id=$id
        SET s.name=$name
      `, { id, name });

      return id;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      session.close();
    }
  }
}

module.exports = EditSet;
