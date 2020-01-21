const Action = require('../../core/action');

class ProfilesQuery extends Action {
  async run() {
    const { id } = this.parent;
    const { driver, me } = this.context;
    const session = driver.session();
    const params = { uid: id || me.id };


    try {
      const { records } = await session.run(`
        match (u:User{id: $uid}),
          (u)-[:OWNS]->(p:Profile),
          (learn:Language)<-[:HAS_LEARNING_LANG]-(p)-[:HAS_TRANSLATION_LANG]->(trans:Language)
        RETURN collect({
          id: p.id,
          name: p.name,
          active: EXISTS((p)<-[:INCLUDES]-(:Active)),
          learnLang: {
            id: learn.id,
            code: learn.code,
            name: learn.name
          },
          transLang: {
            id: trans.id,
            code: trans.code,
            name: trans.name
          }
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
