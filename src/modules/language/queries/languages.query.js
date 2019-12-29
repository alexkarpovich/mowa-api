const Action = require('../../core/action');

class LanguagesQuery extends Action {
  async response() {
    const { driver } = this.context;
    const session = driver.session();
    const res = await session.run('MATCH (lang:Language) RETURN lang');
    session.close();

    return res.records.map(rec => rec.get('lang').properties);
  }
}

module.exports = LanguagesQuery;
