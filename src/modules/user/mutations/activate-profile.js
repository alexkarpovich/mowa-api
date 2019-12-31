const Action = require('../../core/action');

class ActivateProfile extends Action {
  async run() {
    const { id } = this.args;
    const { driver, user } = this.context;
    const session = driver.session();
    const params = { id, uid: user.id };

    try {
      await session.run(`
        MATCH (newActive:Profile{id: $id}),
          (u:User{id: $uid})-[:INCLUDES]->(p:Profile)<-[r:INCLUDES]-(:Active)
        DELETE r
        MERGE (newActive)<-[:INCLUDES]-(:Active)
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
