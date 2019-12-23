const uuid = require('uuid/v4');

const Action = require('../../core/action');

class DetachTranslation extends Action {
  async run() {
    const { driver } = this.context;
    const session = driver.session();

    try {
      await session.run(`
        MATCH (s:Series {id: $seriesId})-[ri:INCLUDES]->(tr:Translation {id: $translationId})
        DELETE ri
      `, this.args);

      return true;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      session.close();
    }
  }
}

module.exports = DetachTranslation;
