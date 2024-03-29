import { Client, Intents } from 'discord.js';

import * as Announcers from './announcers.js';
import * as Command from './commands.js';

const bot = new Client({
  ws: { intents: Intents.ALL & ~Intents.FLAGS.GUILD_PRESENCES },
  partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'],
});

bot.once('ready', () => {
  Announcers.initialize(bot);
});

bot.on('ready', () => {
  console.info(`BIG AMEMORI has (re)logged in to Discord at ${bot.readyAt}.`);

  bot.user?.setPresence({ activity: { type: 'WATCHING', name: 'YOU' } })
    .catch(console.error);
});

bot.on('message', message => {
  switch (message.type) {
    case 'DEFAULT':
      Command.parse(message);
      break;
    default:
      break;
  }
});

bot.login(process.env['BIG_AMEMORI_TOKEN'])
  .catch(console.error);

process.on('exit', () => {
  bot.destroy();
  console.info('BIG AMEMORI has logged out of Discord.');
});

process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT',  () => process.exit(0));
