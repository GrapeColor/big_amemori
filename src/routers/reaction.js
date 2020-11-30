import { Client, User, MessageReaction } from 'discord.js';
import * as Roles from '../roles.js';

/**
 * Validate a added or removed reaction.
 * @param {boolean} add - Whether to add.
 * @param {MessageReaction} reaction - Added or removed a reaction.
 * @param {User} user - A user who reacted.
 */
const validateReaction = async (add, reaction, user) => {
  if (user.bot) return;

  const message = await reaction.message.fetch();
  const botUser = user.client.user;
  if (message.author.id !== botUser?.id) return;

  const member = message.guild?.member(user);
  if (!member) return;

  const label = message.embeds[0].footer.text;
  if (label === 'サーバールール') {
    if (add) Roles.addPrisoner(member);
    else Roles.removePrisoner(member);
  }
  if (label === '独房案内') {
    if (add) Roles.addModelPrisoner(member);
    else Roles.removeModelPrisoner(member);
  }
}

/**
 * Initialize the reaction router.
 * @param {Client} bot - A client to which the reaction router belongs.
 */
export const initReactionRouter = bot => {
  bot.on(
    'messageReactionAdd',
    (reaction, user) =>
      validateReaction(true, reaction, user)
        .catch(console.error)
  );

  bot.on(
    'messageReactionRemove',
    (reaction, user) =>
      validateReaction(false, reaction, user)
        .catch(console.error)
  );
}
