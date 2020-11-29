import { Client, Webhook } from 'discord.js';

/**
 * Fetch (or create) a webhook used by the BOT.
 * @param {Client} bot A client that gets a webhook.
 * @returns {Promise.<Webhook=>}
 */
export const fetchMyWebhook = async bot => {
  const guild = bot.guilds.cache.first();
  const webhooks = await guild.fetchWebhooks();

  return webhooks.size
    ? webhooks.first()
    : await guild.channels.cache
      .find(channel => channel.isText())
      ?.createWebhook();
}
