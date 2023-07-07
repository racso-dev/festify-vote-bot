import { loadConfig, config } from './config.js';
import { Master } from './master.js';
import readline from 'readline';

// Configure readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Wrap rl.question in a Promise
const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

loadConfig(process.argv);

const main = async () => {
  const master = new Master(config);
  console.log('Master config', master.config);
  await master.launch();

  // Start an infinite loop
  while (true) {
    // console.clear();
    let song = await question('Quelle chanson voulez-vous liker ? ');
    let votes = await question('Combien de votes voulez-vous générer ? ');

    // Update config
    master.config.song = song;
    master.config.votes = votes;
    await master.sync();

    // Run voting
    await master.vote();
  }
};

main();
