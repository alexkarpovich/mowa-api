const uuid = require('uuid/v4');

const Action = require('../../core/action');

class AddSet extends Action {
  async run() {
    const { name } = this.args;
    const { driver, me } = this.context;
    const session = driver.session();
    const params = { name, id: uuid(), uid: me.id };

    try {
      const { records } = await session.run(`
        MATCH (u:User)-[:OWNS]->(p:Profile)<-[:INCLUDES]-(:Active) WHERE u.id=$uid
        CREATE (p)-[:INCLUDES]->(s:Set {id: $id, name: $name})
        RETURN s
      `, params);

      const sets = records[0].get('s').properties;

      console.log(sets);

      return sets;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      session.close();
    }
  }
}

module.exports = AddSet;
