import { Client, TextChannel } from 'discord.js';

import YouTube  from './monitors/youtube.js';
import Timeline from './monitors/timeline.js';
import Hashtag  from './monitors/hashtag.js';
import Niconico from './monitors/niconico.js';

const youtube  = new YouTube('UCRWOdwLRsenx2jLaiCAIU4A', 60);
const timeline = new Timeline('Sayo_Amemori', 60);
const hashtag  = new Hashtag('雨森と美術', 60);
const niconico = new Niconico('雨森小夜', 300);

/**
 * Makes an announcement on the specified channel.
 * @param {TextChannel} channel - Channel to make announcements.
 * @param {string[]} urls - URLs to be announced.
 */
const announce = (channel, urls) => {
  urls.forEach(url => {
    channel.send(url)
      .catch(console.error);
  });
}

/**
 * Initialize announcers for each channel.
 * @param {Client} bot - A bot with a channel to set an announcer.
 */
export const initAnnouncers = bot => {
  const channels = bot.channels.cache;

  const youtubeChannel  = channels.find(channel => /<YouTube>/.test(channel.topic));
  const timelineChannel = channels.find(channel => /<Timeline>/.test(channel.topic));
  const hashtagChannel  = channels.find(channel => /<Hashtag>/.test(channel.topic));
  const niconicoChannel = channels.find(channel => /<Niconico>/.test(channel.topic));

  youtube .on('newPosts', urls => announce(youtubeChannel,  urls));
  timeline.on('newPosts', urls => announce(timelineChannel, urls));
  hashtag .on('newPosts', urls => announce(hashtagChannel,  urls));
  niconico.on('newPosts', urls => announce(niconicoChannel, urls));
}
