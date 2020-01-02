const uuid = require('uuid/v4');

const Action = require('../../core/action');

class AttachTranslation extends Action {
  async attachNewTranslation(session) {
    const { input } = this.args;
    const params = {
      ...input,
      value: input.value.trim(),
      id: uuid(),
      newTermId: uuid()
    };

    return session.run(`
        MATCH
          (p:Profile)-[:INCLUDES]->(s:Set {id: $setId}),
          (learnLang:Language)<-[:HAS_LEARNING_LANG]-(p)-[:HAS_TRANSLATION_LANG]->(transLang:Language),
          (t:Term {id: $termId})
        MERGE (transTerm:Term {value: $value})<-[:INCLUDES]-(transLang)
          ON CREATE SET transTerm.id=$newTermId
        MERGE (t)<-[:FROM]-(trans:Translation {transcription: $transcription, details: $details})-[:TO]->(transTerm)
          ON CREATE SET trans.id=$id
        MERGE (s)-[:INCLUDES]->(trans)
        RETURN {
          id: trans.id,
          value: transTerm.value,
          transcription: trans.transcription,
          details: trans.details
        } as translation
      `, params);
  }

  async attachExistingTranslation(session) {
    const { input } = this.args;

    return session.run(`
        MATCH
          (s:Set {id: $setId}),
          (trans:Translation{id: $id})-[:TO]->(transTerm:Term)
        MERGE (s)-[:INCLUDES]->(trans)
        RETURN {
          id: trans.id,
          value: transTerm.value,
          transcription: trans.transcription,
          details: trans.details
        } as translation
      `, input);
  }

  async response() {
    const { input } = this.args;
    const { driver } = this.context;
    const session = driver.session();

    try {
      const { records } = input.id ? await this.attachExistingTranslation(session) :
        await this.attachNewTranslation(session);
      console.log(records);

      return records[0].get('translation');
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      session.close();
    }
  }
}

module.exports = AttachTranslation;
