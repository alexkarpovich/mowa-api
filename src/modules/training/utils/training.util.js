const uuid = require('uuid/v4');

const { TYPE_THROUGH, TYPE_CYCLES } = require('./constant.util');
const ThroughBuilder = require('./through-builder.util');
const CyclesBuilder = require('./cycles-builder.util');
const ThroughIterator = require('./through-iterator.util');
const CyclesIterator = require('./cycles-iterator.util');

class Training {
  constructor(driver, id, type) {
    this.driver = driver;
    this.id = id;
    this.type = type;
  }

  /**
   * Tries to find existing training by type and set ids
   * @param session
   * @param type
   * @param setIds
   * @returns {Promise<*>}
   */
  static async matchExisting(session, type, setIds) {
    const { records } = await session.run(`
        MATCH (train:Training{type: $type})-[:INCLUDES]->(s:Set) WHERE s.id IN $setIds
        MATCH (a:Set)<-[:INCLUDES]-(train)
        WITH train, collect(DISTINCT a.id) as aids
        WHERE ALL(x IN $setIds WHERE x IN aids) AND size(aids) = size($setIds)
        RETURN train.id as id
      `, { type, setIds });

    return records.length ? records[0].get('id') : null;
  }

  /**
   * Creates basic training relations using type and set ids
   * @param session
   * @param type
   * @param setIds
   * @returns {Promise<{type: number}>}
   */
  static async assignSets(session, type, setIds) {
    const { records } = await session.run(`
        CREATE (train:Training {id: $id, type: $type})
        WITH train
        MATCH (s:Set) WHERE s.id IN $setIds
        MERGE (train)-[:INCLUDES]->(s)
        RETURN train.id as id
      `, { type, setIds, id: uuid() });

    return records[0].get('id');
  }

  static async typeById(session, id) {
    const { records } = await session.run(`MATCH (train:Training{id: $id}) RETURN train.type as type`, { id });

    return records.length ? +records[0].get('type') : null;
  }

  /**
   * Initializes training object by matching or creating it.
   * @param props{driver,id,type,setIds}
   * @returns {Training}
   */
  static async init({ driver, id, type, setIds }) {
    const session = driver.session();

    try {

      if (id === undefined) {
        id = await this.matchExisting(session, type, setIds);

        if (!id) {
          id = await this.assignSets(session, type, setIds);
        }
      }

      if (type === undefined) {
        type = await this.typeById(session, id);
      }

    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      session.close();
    }

    return new Training(driver, id, type);
  }

  _builder() {
    switch (this.type) {
      case TYPE_CYCLES:
        return new CyclesBuilder(this.driver, this);
      case TYPE_THROUGH:
      default:
        return new ThroughBuilder(this.driver, this);
    }
  }

  _iterator() {
    switch (this.type) {
      case TYPE_CYCLES:
        return new CyclesIterator(this.driver, this.id);
      case TYPE_THROUGH:
      default:
        return new ThroughIterator(this.driver, this.id);
    }
  }

  async build() {
    const builder = this._builder();
    await builder.build();

    return { id: this.id, type: this.type };
  }

  async next() {
    const iterator = this._iterator();

    return iterator.next();
  }

  async complete(translationId) {
    const iterator = this._iterator();

    return iterator.complete(translationId);
  }
}

module.exports = Training;
