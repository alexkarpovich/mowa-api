const path = require('path');
const appRoot = require('app-root-path').toString();
const fetch = require('node-fetch');

const { Scraper, Key } = require('../../core/scraper');
const { download } = require('../../../utils/http');

class LineDictScraper extends Scraper {
  static URL = 'https://dict.naver.com/linedict/zhendict/dict.html';

  async run() {
    const { term } = this.params;

    await this.driver.get(LineDictScraper.URL);
    await this.waitElementById('ac_input')
      .sendKeys(term, Key.ENTER);

    const pronounceEl = await this.waitElementBySelector('.sound_b');
    const transcriptionEl = await this.findElementBySelector('.prnc _entry_pinyin');
    const urn = await pronounceEl.getAttribute('data-purl');
    const transcription = await transcriptionEl.getAttribute('textContent');
    const pronounceUrl = new URL(urn, LineDictScraper.URL);
    console.log(transcription);
    const res = await fetch(pronounceUrl.href).then(res => res.json());
    console.log(res);
    await download(
      pronounceUrl.href,
      path.join(appRoot, 'media/zh/', `${transcription}.mp3`)
    );

    return true;
  }
}

module.exports = LineDictScraper;
