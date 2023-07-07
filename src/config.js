import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

export let config = {
  url: '',
  capacity: 1,
  stealth: false,
  debug: false,
  headless: false,
  timeOut: 5000,
  browser: {
    headless: false,
  },
  selectors: {
    appShell: '',
    like: '',
    currentSong: '',
    progressBar: '',
    progressBarFrame: ''
  },
};

export const loadConfig = (args) => {
  // Parse command line arguments
  const argv = yargs(hideBin(args))
    .option('url', {
      alias: 'u',
      type: 'string',
      demandOption: true,
    })
    .option('capacity', {
      alias: 'c',
      type: 'number',
      demandOption: true,
      default: 1,
    })
    .option('stealth', {
      alias: 's',
      type: 'boolean',
      default: false,
    })
    .option('debug', {
      alias: 'd',
      type: 'boolean',
      default: false,
    })
    .option('headless', {
      alias: 'h',
      type: 'boolean',
      default: false,
    })
    .option('timeOut').argv;

  const {
    url,
    capacity,
    stealth,
    debug,
    headless,
    timeOut,
  } = argv;

  config = {
    url,
    capacity,
    stealth,
    debug,
    headless,
    timeOut: timeOut || 5000,
    browser: {
      headless: debug ? false : headless || stealth ? 'new' : false,
    },
    selectors: {
      like: 'paper-icon-button[icon="festify:favorite-border"]',
      song: (song) => `paper-icon-button[title="Vote for ${song}"]`,
      appShell: 'app-shell',
      progressBar: '#indicator',
      progressBarFrame: 'playback-progress-bar',
    },
  };
};
