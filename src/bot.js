import { launch } from 'puppeteer';
import { debugLogs, findAllElementsInShadowRoot, findElementInShadowRoot, likeSong } from './utils.js';

export class Bot {
  config = {
    id: 1,
    debug: false,
    stealth: false,
    headless: false,
    song: '',
    votes: 1,
    url: '',
    browser: {
      headless: true,
    },
    selectors: {
      appShell: '',
      like: '',
      currentSong: '',
    },
    timeOut: 5000,
  };

  browser = null;
  context = null;
  page = null;
  shadowHost = null;
  songList = null;
  durationLeftOfCurrentSong = null; // In ms

  constructor(config) {
    this.config = config;
  }

  async init() {
    this.browser = await launch(this.config.browser);
    this.context = await this.browser.createIncognitoBrowserContext();
    this.page = await this.context.newPage();
    
    await this.page.goto(this.config.url);
    await this.page.waitForTimeout(this.config.timeOut);
    
    this.shadowHost = await this.page.$(this.config.selectors.appShell);
    this.songList = await this.getSongList();
    this.durationLeftOfCurrentSong = await this.getDurationLeftOfCurrentSong(this.page);

    debugLogs(`Bot.init(${this.config.id})`, this);
  }

  async getSongList() {
    return await findAllElementsInShadowRoot({
      page: this.page,
      elementHandle: this.shadowHost,
      selector: this.config.selectors.like,
    });
  }

  async getDurationLeftOfCurrentSong() {
    const progressBarFrame = await findElementInShadowRoot({
      page: this.page,
      elementHandle: this.shadowHost,
      selector: this.config.selectors.progressBarFrame,
    });
    const progressBar = await findElementInShadowRoot({
      page: this.page,
      elementHandle: this.shadowHost,
      selector: this.config.selectors.progressBar,
    });

    // On calcule un ratio de la longueur de la chanson en cours
    const progressBarRect = await progressBar.boundingBox();
    const progressBarFrameRect = await progressBarFrame.boundingBox();
    const current = progressBarRect.width;
    const total = progressBarFrameRect.width;
    const ratio = (current / total);
    
    // On récupère la durée de la chanson en cours en ms
    const durationRegex = /transform\s+(\d+)ms/;
    const progressBarStyleValue = await progressBar.evaluate((node) => node.getAttribute('style'));
    const match = durationRegex.exec(progressBarStyleValue);
    const currentSongTotalDuration = match ? parseInt(match[1]) : null;

    return ratio * currentSongTotalDuration;
  }

  async vote() {
    if (this.config.stealth) {
      setTimeout(() => likeSong(this.page, this.shadowHost, this.config.song, this.songList), this.durationLeftOfCurrentSong - 5000);
    } else {
      likeSong(this.page, this.shadowHost, this.config.song, this.songList);
    }
  }

  async close() {
    await this.browser.close();
  }
}
