const Action = require('../../core/action');

class SearchTranslations extends Action {
  async run() {
    const { termId, value } = this.args;
    const { driver, me } = this.context;
    const session = driver.session();
    const params = { value, termId, uid: me.id };

    try {
      const { records } = await session.run(`
        MATCH
          (u:User {id: $uid})-[:OWNS]->(p:Profile)<-[:INCLUDES]-(:Active),
          (transTerm:Term)<-[:INCLUDES]-(transLang:Language)<-[:HAS_TRANSLATION_LANG]-(p)-[:HAS_LEARNING_LANG]->(learnLang:Language),
          (transTerm)<-[:TO]-(tr:Translation)-[:FROM]->(:Term{id: $termId})<-[:INCLUDES]-(learnLang)
        WHERE transTerm.value CONTAINS $value
        RETURN tr, transTerm
      `, params);

      return records.map(rec => ({ ...rec.get('tr').properties, value: rec.get('transTerm').properties.value}));
    } catch (err) {
      throw err;
    } finally {
      session.close()
    }
  }
}

module.exports = SearchTranslations;
