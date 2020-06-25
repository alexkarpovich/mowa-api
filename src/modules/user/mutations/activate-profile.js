const Action = require('../../core/action');

class ActivateProfile extends Action {
  async run() {
    const { id } = this.args;
    const { driver, me } = this.context;
    const session = driver.session();
    const params = { id, uid: me.id };

    try {
      await session.run(`
        MATCH (newActive:Profile{id: $id}), (active:Active),
          (u:User{id: $uid})-[:OWNS]->(p:Profile)<-[r:INCLUDES]-(active)
        DELETE r
        MERGE (newActive)<-[:INCLUDES]-(active)
      `, params);

      return true;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      session.close();
    }
  }
}

module.exports = ActivateProfile;
