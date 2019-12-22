const uuid = require('uuid/v4');

const Action = require('../../core/action');
const { encryptPassword, signToken } = require('../utils/user.utils');

class UserSignup extends Action {
  async run() {
    const { input } = this.args;
    const { driver } = this.context;
    const session = driver.session();
    const { hash, salt } = encryptPassword(input.password);
    const params = {
      ...input,
      id: uuid(),
      hashedPassword: hash,
      salt
    };

    try {
      const { records } = await session.run(`
        CREATE (registrant:User {
          id: $id,
          email: $email,
          hashedPassword: $hashedPassword,
          salt: $salt,
          createdAt: timestamp(),
          updatedAt: timestamp()
        }) RETURN registrant
       `, params);

      const user = records[0].get('registrant').properties;

      return { user, token: signToken(user) };
    } catch (err) {
      console.log(err)
      throw err;
    } finally {
      session.close();
    }
  }
}

module.exports = UserSignup;
