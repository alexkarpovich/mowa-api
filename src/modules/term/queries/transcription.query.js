const Action = require('../../core/action');

class TranscriptionQuery extends Action {
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
          (s:Set)<-[:INCLUDES]-(p:Profile)-[:HAS_TRANSLATION_LANG]->(transLang),
          (t)<-[:FROM]-(trans:Translation)-[:TO]->(transTerm:Term)<-[:INCLUDES]-(transLang)
        WHERE s.id IN $setIds
        RETURN collect(distinct trans.transcription) as transcriptions
      `, params);

      return records[0].get('transcriptions').join(', ');
    } catch (err) {
      throw err;
    } finally {
      session.close()
    }
  }
}

module.exports = TranscriptionQuery;
