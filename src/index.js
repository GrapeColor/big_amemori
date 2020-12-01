import Discord from 'discord.js';

import { initAnnouncers } from './announcers.js';
import { initReactionRouter } from './routers/reaction.js'
import { parseCommand } from './commands.js';
import * as Util from './util.js';

const bot = new Discord.Client({
  ws: { intents: Discord.Intents.NON_PRIVILEGED },
  partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'],
});

let myWebhook;

bot.once('ready', () => {
  initAnnouncers(bot);
  initReactionRouter(bot);

  Util.fetchMyWebhook(bot)
    .then(webhook => myWebhook = webhook)
    .catch(console.error);
});

bot.on('ready', () => {
  console.info(`BIG AMEMORI has (re)logged in to Discord at ${bot.readyAt}.`)

  bot.user?.setPresence({
    activity: {
      type: 'WATCHING',
      name: 'AUTOMATIC DEPLOY',
    }
  })
    .catch(console.error);
});

bot.on('message', message => parseCommand(message, myWebhook));

bot.login(process.env['BIG_AMEMORI_TOKEN'])
  .catch(console.error);
