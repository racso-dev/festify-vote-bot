import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

export let config = {
  url: '',
  song: '',
  votes: 1,
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
    .option('song', {
      alias: 't',
      type: 'string',
      demandOption: true,
    })
    .option('votes', {
      alias: 'v',
      type: 'number',
      demandOption: true,
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
    url: url,
    song: song,
    votes: votes,
    stealth: stealth,
    debug: debug,
    headless: headless,
    timeOut: timeOut,
  } = argv;

  config = {
    url,
    song,
    votes,
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
