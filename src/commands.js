import Discord from 'discord.js';

/**
 * @typedef {Object} MessageDesign
 * @property {number} color - A color of embed.
 * @property {string} icon - An emoji at the beginning of a title.
 */

/**
 * Designs of each message type.
 * @type {Object<string,MessageDesign>}
 */
const messageDesigns = {
  information: { color: 0x1587bf, icon: 'ℹ️' },
  success    : { color: 0x67b160, icon: '✅' },
  failure    : { color: 0xffcd60, icon: '⚠️' },
};

/**
 * Get a message design securely.
 * @param {string} type - A type of a message.
 * @returns {MessageDesign}
 */
const getMessageDesign = type => {
  return (type in messageDesigns) ? messageDesigns[type] : messageDesigns.success;
}

/**
 * Sends an infomation message to the channel.
 * @param {Discord.TextChannel} channel - A channel to send the message to.
 * @param {string} type - A type of a message.
 * @param {string} title - A title of a message.
 * @param {string=} content - A content of a message.
 */
const sendInformation = (channel, type, title, content) => {
  const { color, icon } = getMessageDesign(type);
  const embed = new Discord.MessageEmbed({
    color: color,
    title: `${icon} ${title}`,
    description: content,
  });

  channel.send(embed)
    .catch(console.error);
}

/**
 * Fetches messages of the specified section from a channel.
 * @param {Discord.TextChannel} channel - A channel from which messages are fatched.
 * @param {Discord.Snowflake} startID - A first message id to fetch.
 * @param {Discord.Snowflake} endID - A last message id to fetch.
 * @returns {Promise<Discord.Collection<string,Discord.Message>>}
 */
const fetchMessages = async (channel, startID, endID) => {
  let [after, before] = startID < endID ? [startID, endID] : [endID, startID];
  before = (BigInt(before) + 1n).toString();

  let messages = new Discord.Collection();

  while (after < before) {
    const part = await channel.messages.fetch({ limit: 100, before: before });
    messages = messages.concat(
      part.filter(message => message.id >= after)
    );
    before = part.last().id;
  };

  return messages.sort();
}

/**
 * Use a webhook to transfer messages.
 * @param {Discord.Webhook} webhook - A webhook used for transfer.
 * @param {Discord.Message} message - A message to transfer.
 * @returns {Promise<Discord.Message=>} - Transfered a message.
 */
const transferMessage = async (webhook, message) => {
  const user = message.author;
  const attachmentURLs = message.attachments.map(attachment => attachment.url);

  return await webhook.send(message.content, {
    username       : user.username,
    avatarURL      : user.displayAvatarURL(),
    embeds         : message.embeds,
    files          : attachmentURLs,
    disableMentions: 'all',
  });
}

/**
 * Copy multiple messages to another channel.
 * @param {Discord.Message} command - A message containing a command string.
 * @param {Discord.Webhook} webhook - A webhook used to transfer messages.
 */
const messagesCopy = async (command, webhook) => {
  const fromChannel = command.channel;
  if (!fromChannel.isText()) return;

  const matchCommand = command.content.match(
    /^admin\/copy <#(\d+)> (\d+) (\d+)$/
  );
  if (!matchCommand) {
    sendInformation(
      fromChannel, 'failure', 'コマンドの文法が間違っています',
      '`admin/copy コピー先チャンネル 最初のメッセージID 最後のメッセージID`'
    );
    return;
  }

  const [_, toChannelID, fromMessageID, toMessageID] = matchCommand;

  const toChannel = fromChannel.client.channels.cache.get(toChannelID);
  if (toChannel.type !== 'text' || webhook.guildID !== toChannel.guild?.id) {
    sendInformation(
      fromChannel, 'failure', '送信できないチャンネルです',
      '送信先のチャンネルはサーバー内のテキストチャンネルである必要があります'
    );
    return;
  }

  if (webhook.channelID !== toChannelID)
    await webhook.edit({ channel: toChannelID });

  let messages = await fetchMessages(fromChannel, fromMessageID, toMessageID);

  sendInformation(
    fromChannel, 'information', 'メッセージのコピーを開始します',
    `${fromChannel} から ${toChannel} へ ${messages.size} 件のメッセージがコピーされます`
  )

  let failedMessage;
  for (const message of messages.array())
    try {
      await transferMessage(webhook, message);
    }
    catch {
      failedMessage = message;
      break;
    }

  if (!failedMessage)
    sendInformation(fromChannel, 'success', 'メッセージのコピーに成功しました');
  else
    sendInformation(
      fromChannel, 'failure', 'メッセージのコピーに失敗しました',
      `\`${failedMessage.id}\` 以降のメッセージのコピーが中止されました`
    );
}

/**
 * Deletes all specified messages.
 * @param {Discord.TextChannel} channel - A channel from which messages are deleted.
 * @param {Discord.Collection<string,Discord.Message>} messages - Messages to delete.
 */
const deleteMessages = async (channel, messages) => {
  let remainder = messages;
  const lastID = messages.last().id;
  const buffer = [];

  for (const message of messages.array())
    if (buffer.push(message) === 100 || message.id === lastID) {
      remainder = remainder.difference(await channel.bulkDelete(buffer, true));
      buffer.length = 0;
    }

  for (const message of remainder.array()) await message.delete();
}

/**
 * Delete multiple messages from a channel.
 * @param {Discord.Message} command - A message containing a command string.
 */
const messagesDelete = async command => {
  const channel = command.channel;
  if (channel.type === 'dm') return;

  const matchCommand = command.content.match(/^admin\/delete (\d+) (\d+)$/);
  if (!matchCommand) {
    sendInformation(
      channel, 'failure', 'コマンドの文法が間違っています',
      '`admin/delete 最初のメッセージID 最後のメッセージID`'
    );
    return;
  }

  const [_, fromMessageID, toMessageID] = matchCommand;
  const messages = await fetchMessages(channel, fromMessageID, toMessageID);

  sendInformation(
    channel, 'information', 'メッセージの一斉削除を開始します',
    `${channel} から ${messages.size} 件のメッセージが削除されます`
  );

  deleteMessages(channel, messages)
    .then(
      () => sendInformation(channel, 'success', 'メッセージの一斉削除に成功しました')
    )
    .catch(
      () => sendInformation(channel, 'failure', 'メッセージの一斉削除に失敗しました')
    );
}

/**
 * Parses a command in a message.
 * @param {Discord.Message} message - A message containing a command string.
 * @param {Discord.Webhook} webhook - A webhook used to process commands.
 */
export const parseCommand = (message, webhook) => {
  if (!message.member?.hasPermission('ADMINISTRATOR')) return;

  const content = message.content;

  if (content.startsWith('admin/copy'))
    messagesCopy(message, webhook)
      .catch(console.error);

  if (content.startsWith('admin/delete'))
    messagesDelete(message)
      .catch(console.error);
}
