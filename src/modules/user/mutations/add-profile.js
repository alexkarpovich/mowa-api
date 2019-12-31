const uuid = require('uuid/v4');

const Action = require('../../core/action');

class AddProfile extends Action {
  async run() {
    const { input } = this.args;
    const { driver, user } = this.context;
    const session = driver.session();
    const params = { ...input, id: uuid(), uid: user.id };

    try {
      const { records } = await session.run(`
        MATCH (u:User), (learnLang:Language), (transLang:Language), (a:Active)-[ri:INCLUDES]->(:Profile)<-[:OWNS]-(u) WHERE u.id=$uid AND learnLang.code=$learnLang AND transLang.code=$transLang
        CREATE (learnLang)<-[:HAS_LEARNING_LANG]-(p:Profile {id: $id, name: $name})-[:HAS_TRANSLATION_LANG]->(transLang),
          (u)-[:OWNS]->(p), (a)-[:INCLUDES]->(p)
        DELETE (ri)
        RETURN {
          id: p.id,
          name: p.name,
          active: EXISTS((p)<-[:INCLUDES]-(:Active))
        } as profile
      `, params);

      return records[0].get('profile');
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      session.close();
    }
  }
}

module.exports = AddProfile;
