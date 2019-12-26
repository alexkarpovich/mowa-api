const Action = require('../../core/action');

class TranscriptionQuery extends Action {
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
        RETURN collect(distinct trans.transcription) as transcriptions
      `, { termId, setId });

      return records[0].get('transcriptions').join(', ');
    } catch (err) {
      throw err;
    } finally {
      session.close()
    }
  }
}

module.exports = TranscriptionQuery;
