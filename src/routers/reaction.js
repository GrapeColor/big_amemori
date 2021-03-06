import { Client, User, MessageReaction, GuildMember } from 'discord.js';
import * as Roles from '../roles.js';

/**
 * Branch processing based on the label.
 * @param {string} label - Base label.
 * @param {boolean} add - Whether to add.
 * @param {GuildMember} - A member who reacted.
 */
const router = async (label, add, member) => {
  switch (label) {
    case '独房案内':
      if (add) await Roles.addModelPrisoner(member);
      else await Roles.removeModelPrisoner(member);
      break;
    default:
      break;
  }
}

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

  const member = await message.guild?.members.fetch(user);
  if (!member) return;

  const label = message.embeds[0].footer.text;
  if (label) await router(label, add, member);
}

/**
 * Initialize the reaction router.
 * @param {Client} bot - A client to which the reaction router belongs.
 */
export const initialize = bot => {
  bot.on('messageReactionAdd', (reaction, user) => {
    validateReaction(true, reaction, user)
      .catch(console.error);
  });

  bot.on('messageReactionRemove', (reaction, user) => {
    validateReaction(false, reaction, user)
      .catch(console.error);
  });
}
