import { Client, GuildMember } from 'discord.js';
import { EMBED_DEFAULT_COLOR } from './constants.js';

/**
 * Shows the members who have leaves the guild.
 * @param {GuildMember} member - Leaved member.
 */
const sendLeaveMessage = member => {
  const user = member.user;
  const systemChannel = member.guild.systemChannel;
  if (!systemChannel) return;

  systemChannel.send('', {
    embed: {
      color: EMBED_DEFAULT_COLOR,
      description: `${user.username} (${user}) がサーバーから退出しました`
    }
  })
    .catch(console.error);
}

/**
 * Shows the members who have updates the guild.
 * @param {GuildMember} oldMember - Member before update.
 * @param {GuildMember} newMember - Member After update.
 */
const sendUpdateMessage = (oldMember, newMember) => {
  const oldUser = oldMember.user;
  const newUser = newMember.user;
  if (oldUser.username === newUser.username) return;

  const systemChannel = newMember.guild.systemChannel;
  if (!systemChannel) return;

  systemChannel.send('', {
    embed: {
      color: EMBED_DEFAULT_COLOR,
      description:
        `${newUser.username} (${newUser}) は ${oldUser.username} から名前を変更しました`
    }
  })
    .catch(console.error);
}

/**
 * Initialize process of logger.
 * @param {Client} bot - The BOT to set the logger.
 */
export const initialize = bot => {
  bot.on('guildMemberRemove', sendLeaveMessage);
  bot.on('guildMemberUpdate', sendUpdateMessage);
}
