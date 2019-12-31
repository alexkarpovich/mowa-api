const Action = require('../../core/action');

class ProfilesQuery extends Action {
  async run() {
    const { id } = this.parent;
    const { driver, user } = this.context;
    const session = driver.session();
    const params = { uid: id || user.id };


    try {
      const { records } = await session.run(`
        match (u:User{id: $uid}),
        (u)-[:OWNS]->(p:Profile)
        RETURN collect({
          id: p.id,
          name: p.name,
          active: EXISTS((p)<-[:INCLUDES]-(:Active))
        }) as profiles
      `, params);

      console.log(records[0].get('profiles'));
      return records[0].get('profiles');
    } catch (err) {
      throw err;
    } finally {
      session.close()
    }
  }
}

module.exports = ProfilesQuery;
