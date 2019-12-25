const Action = require('../../core/action');

class TranslationsQuery extends Action {
  async run() {
    const { id:setId } = this.info.variableValues;
    const { id:termId } = this.parent;
    const { driver } = this.context;

    const session = driver.session();

    try {
      const { records } = await session.run(`
        match
          (t:Term {id: $termId}),
          (s:Set{id: $setId})<-[:INCLUDES]-(p:Profile)-[:HAS_TRANSLATION_LANG]->(transLang),
          (t)<-[:FROM]-(trans:Translation)-[:TO]->(transTerm:Term)<-[:INCLUDES]-(transLang)
        RETURN trans,transTerm
      `, { termId, setId });

      return records.map(rec => ({ ...rec.get('trans').properties, value: rec.get('transTerm').properties.value}));
    } catch (err) {
      throw err;
    } finally {
      session.close()
    }
  }
}

module.exports = TranslationsQuery;
