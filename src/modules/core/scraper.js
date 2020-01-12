const { Builder, By, until, Key } = require('selenium-webdriver');

const config = require('../../config');

class Scraper {
  constructor(params) {
    this.params = params;
    this.driver = new Builder()
      .forBrowser('firefox')
      .usingServer(config.get('selenium:uri'))
      //.withCapabilities(capabilities)
      .build()
  }

  static async exec(params = null) {
    const scraper = new this(params);
    let response;

    try {
       response = await scraper.run();
    } catch(err) {
      console.log(err);
    } finally {
      await scraper.quit();
    }

    return response;
  }

  async quit() {
    await this.driver.quit();
  }

  async run() {
    console.log('You should implement the method.');
  }

  findElementBySelector(selector) {
    return this.driver.findElement(By.css(selector));
  }

  waitElementById(id, maxDelay = 20000) {
    return this.driver.wait(
      until.elementLocated(By.id(id)),
      maxDelay
    );
  }

  waitElementBySelector(selector, maxDelay = 20000) {
    return this.driver.wait(
      until.elementLocated(By.css(selector)),
      maxDelay
    );
  }
}

module.exports = { Scraper, Key };
