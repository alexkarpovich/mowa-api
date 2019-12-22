const Action = require('../../core/action');
const { checkPassword, signToken } = require('../utils/user.utils');

class UserLogin extends Action {
  async run() {
    const { email, password } = this.args;
    const { driver } = this.context;
    const session = driver.session();

    try {
      const { records } = await session.run(`
        MATCH (user:User) WHERE user.email=$email RETURN user
       `, { email });

      const user = records[0].get('user').properties;

      if (!checkPassword(user.hashedPassword, password, user.salt)) {
        throw new Error('Неверный email или пароль.');
      }

      return { user, token: signToken(user) };
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      session.close();
    }
  }
}

module.exports = UserLogin;
