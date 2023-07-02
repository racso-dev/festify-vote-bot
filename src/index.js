import { loadConfig, config } from './config.js';
import { Bot } from './bot.js';

loadConfig(process.argv);

const main = async () => {

  const bots = [];
  console.log(`Starting bots with config:`, config);
  for (let i = 0; i < config.votes; i++) {
    const bot = new Bot({...config, id: i + 1});
    await bot.init();
    bots.push(bot);
  }

  for (const bot of bots) {
    console.log(`Bot ${bot.config.id} is voting for ${bot.config.song}`);
    await bot.vote();
  }
};

main();
