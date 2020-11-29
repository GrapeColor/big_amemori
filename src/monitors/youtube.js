import Monitor from './monitor.js';
import Parser from 'rss-parser';

/**
 * The class that monitors new posts on any YouTube channel.
 */
export default class YouTube extends Monitor {
  /**
   * Create a YouTube monitor.
   * @param {string} channelID - The ID of the YouTube channel to monitor.
   * @param {number} interval - Interval to fetch posts.
   */
  constructor(channelID, interval) {
    super(interval);

    this.url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelID}`;
    this.parser = new Parser();
    this.lastID = '';
  }

  /**
   * Fetch a RSS and emit an event as new posts.
   * @param {Date} lastCheck - The date when the last post was checked.
   * @returns {Promise.<string[]>}
   * @private
   */
  async fetch(lastCheck) {
    const feed = await this.parser.parseURL(this.url);
    const urls = feed.items
      .filter(
        item =>
          Date.parse(item.pubDate) > lastCheck.getTime() && this.lastID !== item.id
      )
      .map(
        item => item.link
      );

    this.lastID = feed.items[0]?.id;

    return urls;
  }
}
