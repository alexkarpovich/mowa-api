const uuid = require('uuid/v4');

const Action = require('../../core/action');

class AttachTranslation extends Action {
  async run() {
    const { input } = this.args;
    const { driver, user } = this.context;
    const session = driver.session();
    const params = {
      ...input,
      id: uuid(),
      newTermId: uuid(),
      uid: user.id
    };

    try {
      const { records } = await session.run(`
        MATCH
          (u:User {id: $uid}),
          (a:Active)-[ri:INCLUDES]->(p:Profile)<-[:OWNS]-(u),
          (learnLang:Language)<-[:HAS_LEARNING_LANG]-(p)-[:HAS_TRANSLATION_LANG]->(transLang:Language),
          (s:Series {id: $seriesId}),
          (t:Term {id: $termId})
        MERGE (t)<-[:FROM]-(tr:Translation {transcription: $transcription, details: $details})-[:TO]->(trt:Term {value: $value})<-[:INCLUDES]-(transLang)
          ON CREATE SET tr.id=$id, trt.id=$newTermId
        MERGE (s)-[:INCLUDES]->(tr)
        RETURN tr
      `, params);

      const translation = records[0].get('tr').properties;

      return { ...translation };
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      session.close();
    }
  }
}

module.exports = AttachTranslation;
