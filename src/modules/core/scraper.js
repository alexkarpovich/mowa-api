const { Builder, By, until } = require('selenium-webdriver');
const { Profile } = require('selenium-webdriver/firefox');

const config = require('../../config');
const profile = new Profile();

profile.setPreference('browser.download.folderList', 0);
profile.setPreference('browser.download.manager.showWhenStarting', false);
profile.setPreference('browser.download.manager.focusWhenStarting', false);
profile.setPreference('browser.download.useDownloadDir', true);
profile.setPreference('browser.helperApps.alwaysAsk.force', false);
profile.setPreference('browser.download.manager.alertOnEXEOpen', false);
profile.setPreference('browser.download.manager.closeWhenDone', true);
profile.setPreference('browser.download.manager.showAlertOnComplete', false);
profile.setPreference('browser.download.manager.useWindow', false);
profile.setPreference('browser.helperApps.neverAsk.saveToDisk', 'application/octet-stream');

const capabilities = {
  'browserName' : 'firefox',
  // 'browserstack.user' : 'USERNAME',
  // 'browserstack.key' : 'ACCESS_KEY',
  'browserstack.debug' : 'true',
  'name': 'MOWA',
  'firefox_profile' : profile
};

export class Scraper {
  constructor() {
    this.driver = new Builder()
      .forBrowser('firefox')
      .usingServer(config.get('selenium:uri'))
      .withCapabilities(capabilities)
      .build()
  }

  async run() {
    console.log('You should implement the method.');
  }

  waitElementById(id, maxDelay = 20000) {
    return this.driver.wait(
      until.elementLocated(By.id(id)),
      maxDelay
    );
  }
}
