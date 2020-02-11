const uuid = require('uuid/v4');

class BaseBuilder {
  constructor(driver, type, setIds) {
    this.driver = driver;
    this.type = type;
    this.setIds = setIds;
  }

  async matchExisting(session) {
    const { type, setIds } = this;
    const { records } = await session.run(`
        MATCH (train:Training{type: $type})-[:INCLUDES]->(s:Set) WHERE s.id IN $setIds
        MATCH (a:Set)<-[:INCLUDES]-(train)
        WITH train, collect(DISTINCT a.id) as aids
        WHERE ALL(x IN $setIds WHERE x IN aids) AND size(aids) = size($setIds)
        RETURN train
      `, { type, setIds });

    return records.length ? this.formatResponse(records[0].get('train').properties) : null;
  }

  async assignSets(session) {
    const { type, setIds } = this;
    const { records } = await session.run(`
        CREATE (train:Training {id: $id, type: $type})
        WITH train
        MATCH (s:Set) WHERE s.id IN $setIds
        MERGE (train)-[:INCLUDES]->(s)
        RETURN train
      `, { type, setIds, id: uuid() });

    return this.formatResponse(records[0].get('train').properties);
  }

  formatResponse(data) {
    return { ...data, type: +data.type };
  }
}

module.exports = BaseBuilder;
