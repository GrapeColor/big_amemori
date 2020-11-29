import { Guild, GuildMember, Role } from 'discord.js';

const prisonerName = '服役囚';
const modelPrisonerName = '模範囚';

/**
 * Gets the role of a name passed by a guild.
 * @param {Guild} guild - A guild that will get the role.
 * @param {string} roleName - A name of the role to get.
 * @returns {Role=} - Acquired the role. Undefined if it doesn't exist.
 */
const getRole = (guild, roleName) => {
  return guild.roles.cache.find(role => role.name === roleName);
}

/**
 * Add a member the role of a prisoner.
 * @param {GuildMember} member - A member who add the role.
 */
export const addPrisoner = member => {
  const role = getRole(member.guild, prisonerName);
  role && member.roles.add(role);
}

/**
 * Remove a member the role of a prisoner.
 * @param {GuildMember} member - A member who remove the role.
 */
export const removePrisoner = member => {
  const role = getRole(member.guild, prisonerName);
  role && member.roles.remove(role);
}

/**
 * Add a member the role of a model prisoner.
 * @param {GuildMember} member - A member who add the role.
 */
export const addModelPrisoner = member => {
  const role = getRole(member.guild, modelPrisonerName);
  role && member.roles.add(role);
}

/**
 * Remove a member the role of a model prisoner.
 * @param {GuildMember} member - A member who remove the role.
 */
export const removeModelPrisoner = member => {
  const role = getRole(member.guild, modelPrisonerName);
  role && member.roles.remove(role)
}
