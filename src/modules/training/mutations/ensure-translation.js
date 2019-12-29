const uuid = require('uuid/v4');

const Action = require('../../core/action');

class EnsureTranslation extends Action {
  async getExisting(session) {
    const { type, setIds } = this.args;

    return session.run(`
        MATCH (train:Training{type: $type})-[:INCLUDES]->(s:Set) WHERE s.id IN $setIds
        MATCH (a:Set)<-[:INCLUDES]-(train)
        WITH train, collect(DISTINCT a.id) as aids
        WHERE ALL(x IN $setIds WHERE x IN aids) AND size(aids) = size($setIds)
        RETURN train
      `, { type, setIds });
  }

  async createTraining(session) {
    const { type, setIds } = this.args;

    return session.run(`
        CREATE (train:Training {id: $id, type: $type})
        WITH train
        MATCH (s:Set) WHERE s.id IN $setIds
        MERGE (train)-[:INCLUDES]->(s)
        RETURN train
      `, { type, setIds, id: uuid() });
  }

  formatResponse(data) {
    return { ...data, type: +data.type };
  }

  async response() {
    const { driver } = this.context;
    const session = driver.session();

    try {
      const { records:existing } = await this.getExisting(session);

      if (existing.length) {
        return this.formatResponse(existing[0].get('train').properties);
      }

      const { records } = await this.createTraining(session);

      return this.formatResponse(records[0].get('train').properties);
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      session.close();
    }
  }
}

module.exports = EnsureTranslation;
