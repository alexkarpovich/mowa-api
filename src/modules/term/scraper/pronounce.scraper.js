const { Scraper } = require('../../core/scraper');

class PronounceScraper extends Scraper {
  static URL = 'https://dict.naver.com/linedict/zhendict/dict.html';

  async run() {
    this.driver.get(PronounceScraper.URL);
    const input = this.waitElementById('ac_input');
    console.log(input);
  }
}

module.exports = PronounceScraper;
