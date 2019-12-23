const Action = require('../../core/action');

class SearchTranslations extends Action {
  async run() {
    const { value } = this.args;
    const { driver, user } = this.context;
    const session = driver.session();
    const params = { valueRe: `.*${value}.*`, uid: user.id };

    try {
      const { records } = await session.run(`
        MATCH
          (u:User {id: $uid})-[:OWNS]->(p:Profile)<-[:INCLUDES]-(:Active),
          (transTerm:Term)<-[:INCLUDES]-(transLang:Language)<-[:HAS_TRANSLATION_LANG]-(p)-[:HAS_LEARNING_LANG]->(learnLang:Language),
          (transLang)-[:INCLUDES]->(transTerm)<-[:TO]-(tr:Translation)-[:TO]->(transTerm)
        WHERE transTerm.value ~= {valueRe}
        RETURN transTerm, tr
      `, params);

      return records.map(rec => rec.get('tr').properties);
    } catch (err) {
      throw err;
    } finally {
      session.close()
    }
  }
}

module.exports = SearchTranslations;
