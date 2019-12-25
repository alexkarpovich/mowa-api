const uuid = require('uuid/v4');

const Action = require('../../core/action');

class AttachTranslation extends Action {
  async run() {
    const { input } = this.args;
    const { driver } = this.context;
    const session = driver.session();
    const params = {
      ...input,
      id: uuid(),
      newTermId: uuid()
    };

    try {
      const { records } = await session.run(`
        MATCH
          (p:Profile)-[:INCLUDES]->(s:Set {id: $setId}),
          (learnLang:Language)<-[:HAS_LEARNING_LANG]-(p)-[:HAS_TRANSLATION_LANG]->(transLang:Language),
          (t:Term {id: $termId})
        MERGE (t)<-[:FROM]-(trans:Translation {transcription: $transcription, details: $details})-[:TO]->(transTerm:Term {value: $value})<-[:INCLUDES]-(transLang)
          ON CREATE SET trans.id=$id, transTerm.id=$newTermId
        MERGE (s)-[:INCLUDES]->(trans)
        RETURN trans, transTerm
      `, params);

      return { ...records[0].get('trans').properties, value: records[0].get('transTerm').properties.value };
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      session.close();
    }
  }
}

module.exports = AttachTranslation;
