import { millisToMinutesAndSeconds, getSongsList } from './utils.js';
import { Slave } from './slave.js';
import { launch } from 'puppeteer';

export class Master {
    constructor(config) {
        this.config = config;
        this.votingIn = 0; // Time in ms before voting
        this.slaves = [];
        this.browser = null;
        this.context = null;
        this.page = null;
        this.shadowHost = null;
        this.songList = null;
        this.playList = null;
    }

    async sync() {
        for (const slave of this.slaves)
            await slave.sync(this.config);
        this.songList = await getSongsList(this.page, this.shadowHost);
    }

    async init() {
        this.browser = await launch(this.config.browser);
        this.context = await this.browser.createIncognitoBrowserContext();
        this.page = await this.context.newPage();

        await this.page.goto(this.config.url);
        await this.page.waitForTimeout(this.config.timeOut);

        this.shadowHost = await this.page.$(this.config.selectors.appShell);
        this.songList = await getSongsList(this.page, this.shadowHost);
    }

    async launch() {
        await this.init();
        console.log('Voting in', millisToMinutesAndSeconds(this.votingIn))

        const slavePromises = Array.from({ length: this.config.capacity }, async (_, i) => {
            const slave = new Slave({ ...this.config, id: i + 1 });
            await slave.launch();
            this.slaves.push(slave);
            console.log('Slave', i + 1, 'launched');
        });

        await Promise.all(slavePromises);
    }

    async vote() {
        if (!this.songList.includes(this.config.song)) {
            console.log('Song', this.config.song, 'has not been found in', this.songList);
            return;
        }
        const votes = [];
        for (let i = 0; i < this.config.votes; i++) {
            votes.push(await this.slaves[i].vote());
        }
        setTimeout(async () => await Promise.all(votes), this.votingIn);
    }

    async close() {
        for (const slave of this.slaves) {
            await slave.close();
        }
        await this.browser?.close();
    }
}

export default Master;
