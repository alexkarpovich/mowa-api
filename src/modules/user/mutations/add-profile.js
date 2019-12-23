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
        RETURN p, learnLang, transLang
      `, params);

      const profile = records[0].get('p').properties;
      const learnLang = records[0].get('learnLang').properties;
      const transLang = records[0].get('transLang').properties;

      console.log(profile, learnLang, transLang);

      return { ...profile, learnLang, transLang };
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      session.close();
    }
  }
}

module.exports = AddProfile;
