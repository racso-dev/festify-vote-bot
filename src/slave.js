import { launch } from 'puppeteer';
import { debugLogs, findAllElementsInShadowRoot, findElementInShadowRoot } from './utils.js';

export class Slave {
  constructor(config) {
    this.config = config;
    this.browser = null;
    this.context = null;
    this.page = null;
    this.shadowHost = null;

    this.likeSongElement = null;
    this.songsLiked = {};
  }

  async getLikeSongElement() {
    return await findElementInShadowRoot({
      page: this.page,
      elementHandle: this.shadowHost,
      selector: this.config.selectors.song(this.config.song),
    });
  }

  async sync(config) {
    this.config = config;
    this.shadowHost = await this.page.$(this.config.selectors.appShell);
    this.likeSongElement = await this.getLikeSongElement();
  }

  async launch() {
    this.browser = await launch(this.config.browser);
    this.context = await this.browser.createIncognitoBrowserContext();
    this.page = await this.context.newPage();

    await this.page.goto(this.config.url);
    await this.page.waitForTimeout(this.config.timeOut);

    debugLogs(`Slave.launch(${this.config.id})`, this);
  }

  async vote() {
    if (!this.songsLiked[this.config.song] && this.likeSongElement) {
      await this.likeSongElement.click();
      console.log('Slave', this.config.id, 'voted')
      this.songsLiked[this.config.song] = true;
    }
  }

  async unvote() {
    if (this.songsLiked[this.config.song]) {
      await this.likeSongElement.click();
      console.log('Slave', this.config.id, 'unvoted')
      this.songsLiked[this.config.song] = false;
    }
  }

  async close() {
    await this.browser.close();
  }
}

export default Slave;