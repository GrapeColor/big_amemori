import { Message } from 'discord.js';
import * as Roles from './roles.js'; 

/**
 * Validate the message and grant the member a role.
 * @param {Message} message - Message to verify.
 */
export const giveRole = message => {
  const member = message.member;
  if (member) Roles.addPrisoner(member)
    .catch(console.error);
}
