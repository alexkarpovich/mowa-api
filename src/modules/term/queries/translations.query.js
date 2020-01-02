const Action = require('../../core/action');

class TranslationsQuery extends Action {
  async response() {
    const { ids:setIds, id } = this.info.variableValues;
    const { id:termId } = this.parent;
    const { driver } = this.context;
    const params = { setIds: setIds || [id], termId };

    const session = driver.session();

    try {
      const { records } = await session.run(`
        MATCH
          (t:Term {id: $termId}),
          (s:Set)<-[:INCLUDES]-(p:Profile)-[:HAS_TRANSLATION_LANG]->(transLang)
        WHERE s.id IN $setIds
        OPTIONAL MATCH
          (s)-[:INCLUDES]->(trans:Translation)-[:TO]->(transTerm:Term)<-[:INCLUDES]-(transLang), (t)<-[:FROM]-(trans)
        WITH DISTINCT trans, transTerm
        RETURN
          CASE trans.id
            WHEN null THEN null
            ELSE {
              id: trans.id,
              value: transTerm.value,
              transcription: trans.transcription,
              details: trans.details
            }
          END as translation
      `, params);

      return records.filter(rec => rec.get('translation'))
                    .map(rec => rec.get('translation'));
    } catch (err) {
      throw err;
    } finally {
      session.close()
    }
  }
}

module.exports = TranslationsQuery;
