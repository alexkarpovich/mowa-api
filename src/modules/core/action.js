class Action {
  constructor({ parent, args, context, info }) {
    this.parent = parent;
    this.args = args;
    this.context = context;
    this.info = info;
  }

  async response() {
    throw new Error(
      `Abstract method "response" of class "${this.constructor.name}" should be implemented.`
    );
  }

  async run() {
    return this.response();
  }

  static async exec(args) {
    const action = new this(args);
    return action.run();
  }
}

module.exports = Action;
