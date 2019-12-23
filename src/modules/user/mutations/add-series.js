const uuid = require('uuid/v4');

const Action = require('../../core/action');

class AddSeries extends Action {
  async run() {
    const { name } = this.args;
    const { driver, user } = this.context;
    const session = driver.session();
    const params = { name, id: uuid(), uid: user.id };

    try {
      const { records } = await session.run(`
        MATCH (u:User)-[:OWNS]->(p:Profile)<-[:INCLUDES]-(:Active) WHERE u.id=$uid
        CREATE (p)-[:INCLUDES]->(s:Series {id: $id, name: $name})
        RETURN s
      `, params);

      const series = records[0].get('s').properties;

      console.log(series);

      return series;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      session.close();
    }
  }
}

module.exports = AddSeries;
