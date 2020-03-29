const uuid = require('uuid/v4');

const { TYPE_THROUGH, TYPE_CYCLES, HANDLER_BUILDER, HANDLER_ITERATOR, HANDLER_META } = require('./constant.util');
const ThroughBuilder = require('./through-builder.util');
const ThroughIterator = require('./through-iterator.util');
const ThroughMeta = require('./through-meta.util');
const CyclesBuilder = require('./cycles-builder.util');
const CyclesIterator = require('./cycles-iterator.util');
const CyclesMeta = require('./cycles-meta.util');

const HANDLERS = {
  [TYPE_THROUGH]: {
    [HANDLER_BUILDER]: ThroughBuilder,
    [HANDLER_ITERATOR]: ThroughIterator,
    [HANDLER_META]: ThroughMeta,
  },
  [TYPE_CYCLES]: {
    [HANDLER_BUILDER]: CyclesBuilder,
    [HANDLER_ITERATOR]: CyclesIterator,
    [HANDLER_META]: CyclesMeta,
  }
};

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

  _handler(handlerType) {
    const Handler = HANDLERS[this.type][handlerType];

    if (!Handler) {
      throw new Error('No handler for such params.')
    }

    return new Handler(this.driver, this.id);
  }

  async build() {
    const builder = this._handler(HANDLER_BUILDER);
    await builder.build();

    return { id: this.id, type: this.type };
  }

  async meta() {
    const meta = this._handler(HANDLER_META);

    return meta.collect();
  }

  async next() {
    const iterator = this._handler(HANDLER_ITERATOR);

    return iterator.next();
  }

  async complete(translationId) {
    const iterator = this._handler(HANDLER_ITERATOR);

    return iterator.complete(translationId);
  }

  async reset() {
    const iterator = this._handler(HANDLER_ITERATOR);

    return iterator.reset();
  }
}

module.exports = Training;
